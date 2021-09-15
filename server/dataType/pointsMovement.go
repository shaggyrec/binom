package dataType

import "github.com/go-pg/pg"

type PointsMovement struct {
	Id string `json:"id"`
	UserId string `json:"userId"`
	Amount int `json:"amount"`
	Description string `json:"description"`
	Created pg.NullTime `json:"created"`
}
