package dataType

import (
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
	"time"
)

type TariffPrice struct {
	Id string `json:"id"`
	TariffId int `json:"tariffId"`
	Price int `json:"price"`
	Duration int `json:"duration"`
	Created pg.NullTime `json:"created"`
	RiseOn int `json:"riseOn"`
	RisePeriod int `json:"risePeriod"`
}

type Tariff struct {
	Id int `json:"id"`
	Name string `json:"name"`
	Description string `json:"description"`
	Prices []TariffPrice `json:"prices"`
	Created pg.NullTime `json:"created"`
	Status null.Int `json:"status"`
}

type UserSubscription struct {
	Id string `json:"id"`
	UserId string `json:"user_id"`
	Subscription *Tariff `pg:"rel:has-one" json:"subscription"`
	PaidPrice int `json:"paidPrice"`
	Created pg.NullTime `json:"created"`
	Expired time.Time `json:"expired"`
	Status null.Int `json:"status"`
	Topics []string `json:"topics"`
}