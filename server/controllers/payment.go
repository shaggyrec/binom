package controllers

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/requests"
	"binom/server/service"
	"binom/server/storage"
	"fmt"
	"github.com/go-chi/render"
	"gopkg.in/guregu/null.v4"
	"log"
	"net/http"
	"net/url"
	"strconv"
)

type PaymentController struct {
	yooMoneyService         *service.YoomoneyService
	transactionStorage      *storage.TransactionStorage
	userSubscriptionStorage *storage.UserSubscriptionStorage
	notificationService     *service.NotificationService
}

func (c *PaymentController) Init(yooMoneyService *service.YoomoneyService, transactionStorage *storage.TransactionStorage,
	userSubscriptionStorage *storage.UserSubscriptionStorage, notificationService *service.NotificationService) {
	c.yooMoneyService = yooMoneyService
	c.transactionStorage = transactionStorage
	c.userSubscriptionStorage = userSubscriptionStorage
	c.notificationService = notificationService
}

func (c *PaymentController) YooMoney(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		log.Println("Bad body")
		exceptions.BadRequestError(w, r, "Bad body", exceptions.ErrorBadParam)
		return
	}

	paymentData := c.parseData(r.Form)

	if !c.yooMoneyService.IsDataValid(paymentData) {
		log.Println("Data invalid")
		exceptions.BadRequestError(w, r, "Data invalid", exceptions.ErrorBadParam)
		return
	}

	amount, err := strconv.ParseFloat(paymentData.Amount, 64)
	withdrawAmount, err := strconv.ParseFloat(paymentData.WithdrawAmount, 64)

	if err != nil {
		log.Println("Bad amount")
		log.Println(err)
		exceptions.BadRequestError(w, r, "Bad amount", exceptions.ErrorBadParam)
		return
	}

	transaction := dataType.Transaction{
		Amount:      amount,
		Service:     dataType.PaymentServiceYoomoney,
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
			exceptions.NotFoundError(w, r, subscription.Id+" not found")
			return
		}

		if subscription.Status.Int64 == dataType.StatusLive {
			log.Println(subscription.Id + " already paid")
			exceptions.BadRequestError(w, r, subscription.Id+" already paid", exceptions.ErrorBadParam)
			return
		}

		if int(withdrawAmount) < subscription.PaidPrice {
			log.Println(subscription.Id + " amounts not matched")
			exceptions.BadRequestError(w, r, subscription.Id+" amounts not matched", exceptions.ErrorBadParam)
			return
		}

		subscription.Status = null.IntFrom(dataType.StatusLive)
		subscription.TransactionId = transaction.Id

		_, err = c.userSubscriptionStorage.Update(subscription)

		if err != nil {
			log.Println(err)
			exceptions.ServerError(w, r)
			return
		}
		notification := dataType.Notification{
			Message: fmt.Sprintf(
				"Активирована подписка %s",
				subscription.Name,
			),
			Type: null.IntFrom(dataType.NotificationSubscriptionActivate),
		}
		err = c.notificationService.Create(&notification, []string{subscription.UserId})
		if err != nil {
			log.Println(err)
			return
		}
		c.notificationService.CreateForAdmins(&dataType.Notification{
			Message: fmt.Sprintf(
				"Оплачена подписка %s",
				subscription.Name,
			),
			Type: null.IntFrom(dataType.NotificationSubscriptionActivate),
		})
	}

	render.JSON(w, r, "ok")
}

func (c *PaymentController) parseData(form url.Values) requests.YooMoneyRequest {
	r := requests.YooMoneyRequest{
		NotificationType: form["notification_type"][0],
		OperationId:      form["operation_id"][0],
		Amount:           form["amount"][0],
		Currency:         form["currency"][0],
		Datetime:         form["datetime"][0],
		Sender:           form["sender"][0],
		Codepro:          form["codepro"][0],
		Label:            form["label"][0],
		Sha1Hash:         form["sha1_hash"][0],
		WithdrawAmount:   form["amount"][0],
	}

	if val, ok := form["withdraw_amount"]; ok {
		r.WithdrawAmount = val[0]
	}
	return r
}
