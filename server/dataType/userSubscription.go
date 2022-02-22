package dataType

import (
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
)

type UserSubscription struct {
	Id            string      `json:"id"`
	UserId        string      `json:"userId"`
	Name          string      `json:"name"`
	PaidPrice     int         `json:"paidPrice"`
	Created       pg.NullTime `json:"created"`
	Status        null.Int    `json:"status"`
	Topics        []string    `json:"topics"`
	TransactionId string      `json:"transactionId"`
}
