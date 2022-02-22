package service

import (
	"binom/server/dataType"
	"binom/server/requests"
	"crypto/sha1"
	"encoding/hex"
	"strconv"
	"strings"
)

const YoomoneyReceiver = "41001736101435"
const YoomoneySecret = "NQdbEaOcVaFhnI6HR5BLVS9e"

type YoomoneyService struct {
	host string
}

func (s *YoomoneyService) Init(host string) {
	s.host = host
}

func (s *YoomoneyService) IsDataValid(data requests.YooMoneyRequest) bool {
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
			YoomoneySecret,
			data.Label,
		},
		"&",
	)))
	return hex.EncodeToString(h.Sum(nil)) == data.Sha1Hash
}

func (s *YoomoneyService) GetPaymentParams(subscription *dataType.UserSubscription) map[string]string {
	comment := "Binom. " + subscription.Name

	return map[string]string{
		"label":         subscription.Id,
		"sum":           strconv.Itoa(subscription.PaidPrice),
		"formcomment":   comment,
		"short-dest":    comment,
		"quickpay-form": "shop",
		"targets":       comment,
		"paymentType":   "AC",
		"receiver":      YoomoneyReceiver,
		"successURL":    "https://" + s.host + "/app",
	}

}
