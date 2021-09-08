package dataType

import "gopkg.in/guregu/null.v4"

const PaymentServiceYoomoney = "yoomoney"

type Transaction struct {
	Id string `json:"id"`
	Amount float64 `json:"amount"`
	Created null.Time `json:"created"`
	Service string `json:"service"`
	PaymentData map[string]interface{} `json:"paymentData"`
}
