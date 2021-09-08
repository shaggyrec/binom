package dataType

import (
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
	"time"
)

type UserSubscription struct {
	Id string `json:"id"`
	UserId string `json:"userId"`
	Name string `json:"name"`
	Duration int `json:"duration"`
	TariffId int `json:"tariffId"`
	Tariff *Tariff `pg:"rel:has-one" json:"tariff"`
	PaidPrice int `json:"paidPrice"`
	Created pg.NullTime `json:"created"`
	Expired time.Time `json:"expired"`
	Status null.Int `json:"status"`
	Topics []string `json:"topics"`
	TransactionId string `json:"transactionId"`
}
