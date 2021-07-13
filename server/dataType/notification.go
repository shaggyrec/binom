package dataType

import (
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
)

type Notification struct {
	Id string `json:"id"`
	Message null.String `json:"message"`
	Type null.Int `json:"type"`
	Created pg.NullTime `json:"created"`
}
