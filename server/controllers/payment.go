package controllers

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/requests"
	"binom/server/service"
	"binom/server/storage"
	"crypto/sha1"
	"database/sql"
	"encoding/hex"
	"fmt"
	"github.com/go-chi/render"
	"gopkg.in/guregu/null.v4"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

type PaymentController struct{
	yooMoneySecret string
	transactionStorage *storage.TransactionStorage
	userSubscriptionStorage *storage.UserSubscriptionStorage
	notificationService *service.NotificationService
}

func (c *PaymentController) Init(yooMoneySecret string, transactionStorage *storage.TransactionStorage, userSubscriptionStorage *storage.UserSubscriptionStorage, notificationService *service.NotificationService) {
	c.yooMoneySecret = yooMoneySecret
	c.transactionStorage = transactionStorage
	c.userSubscriptionStorage = userSubscriptionStorage
	c.notificationService = notificationService
}

func (c *PaymentController) YooMoney(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		exceptions.BadRequestError(w, r, "Bad body", exceptions.ErrorBadParam)
		return
	}

	paymentData := c.parseData(r.Form)

	if !c.isDataValid(paymentData) {
		exceptions.BadRequestError(w, r, "Data invalid", exceptions.ErrorBadParam)
		return
	}

	amount, err := strconv.ParseFloat(paymentData.Amount, 64)
	withdrawAmount, err := strconv.Atoi(paymentData.WithdrawAmount)

	if err != nil {
		exceptions.BadRequestError(w, r, "Bad amount", exceptions.ErrorBadParam)
		return
	}

	transaction := dataType.Transaction{
		Amount: amount,
		Service: dataType.PaymentServiceYoomoney,
		PaymentData: functions.InterfaceToMap(paymentData),
	}

	_, err = c.transactionStorage.Store(&transaction)
	if err != nil {
		log.Println(err)
		exceptions.ServerError(w, r)
		return
	}

	if paymentData.Label != "" {
		subscription, err := c.userSubscriptionStorage.ById(paymentData.Label)
		if err != nil {
			log.Println(err)
			exceptions.NotFoundError(w, r, subscription.Id + " not found")
			return
		}

		if subscription.Status.Int64 == dataType.StatusLive {
			log.Println(subscription.Id + " already paid")
			exceptions.BadRequestError(w, r, subscription.Id + " already paid", exceptions.ErrorBadParam)
			return
		}

		if withdrawAmount < subscription.PaidPrice {
			log.Println(subscription.Id + " amounts not matched")
			exceptions.BadRequestError(w, r, subscription.Id + " amounts not matched", exceptions.ErrorBadParam)
			return
		}
		activeSubscriptions := c.userSubscriptionStorage.ByUserId("da925358-de21-47ab-8e22-b4e04b542e8e", []int{1})
		dateStart := time.Now()
		if len(*activeSubscriptions) != 0 {
			for _, activeSubscription := range *activeSubscriptions {
				if activeSubscription.Expired.After(dateStart) {
					dateStart = activeSubscription.Expired
				}
			}
		}
		// c.userSubscriptionStorage
		subscription.Status.Int64 = dataType.StatusLive
		subscription.Status.Valid = true
		subscription.Expired = dateStart.AddDate(0, subscription.Duration, 0)

		_, err = c.userSubscriptionStorage.Update(subscription)

		if err != nil {
			log.Println(err)
			exceptions.ServerError(w, r)
			return
		}
		notification := dataType.Notification{
			Message: fmt.Sprintf(
				"Активирована подписка %s до %s",
				subscription.Name,
				subscription.Expired.Format("02.01.2006"),
			),
			Type: null.Int{NullInt64: sql.NullInt64{Int64: dataType.NotificationSubscriptionActivate}},
		}
		err = c.notificationService.Create(&notification, []string{subscription.UserId})

		if err != nil {
			log.Println(err)
			return
		}
	}

	render.JSON(w, r, "ok")
}

func (c *PaymentController) isDataValid(data requests.YooMoneyRequest) bool {
	h := sha1.New()
	h.Write([]byte(strings.Join(
		[]string{
			data.NotificationType,
			data.OperationId,
			data.Amount,
			data.Currency,
			data.Datetime,
			data.Sender,
			data.Codepro,
			c.yooMoneySecret,
			data.Label,
		},
		"&",
	)))
	return hex.EncodeToString(h.Sum(nil)) == data.Sha1Hash
}
func(c *PaymentController) parseData(form url.Values) requests.YooMoneyRequest {
	return requests.YooMoneyRequest{
		NotificationType: form["notification_type"][0],
		OperationId:      form["operation_id"][0],
		Amount:           form["amount"][0],
		Currency:         form["currency"][0],
		Datetime:         form["datetime"][0],
		Sender:           form["sender"][0],
		Codepro:          form["codepro"][0],
		Label:            form["label"][0],
		Sha1Hash:         form["sha1_hash"][0],
		WithdrawAmount:   form["withdraw_amount"][0],
	}
}