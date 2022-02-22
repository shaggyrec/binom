package dataType

import (
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
)

type Course struct {
	Id      string      `json:"id"`
	Name    null.String `json:"name"`
	Created pg.NullTime `json:"created"`
	Text    null.String `json:"text"`
	Pos     null.Int    `json:"pos"`
	Alias   null.String `json:"alias"`
	Topics  []Topic     `pg:"rel:has-many" json:"topics"`
	Active  bool        `json:"active"`
}
