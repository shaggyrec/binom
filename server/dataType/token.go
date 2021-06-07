package dataType

import "github.com/go-pg/pg"

type Token struct {
	Id string
	Token string
	UserId string
	Created pg.NullTime
}
