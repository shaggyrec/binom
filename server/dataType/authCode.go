package dataType

import (
	"database/sql"
	"github.com/go-pg/pg"
)

type AuthCode struct {
	Id string
	Recipient string
	Code string
	Created pg.NullTime
	Valid sql.NullBool
}