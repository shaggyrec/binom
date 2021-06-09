package dataType

import "github.com/go-pg/pg"

type Topic struct {
	Id string `json:"id"`
	Name NullString `json:"name"`
	Created pg.NullTime `json:"created"`
	Text NullString `json:"text"`
	Pos NullInt `json:"pos"`
	Alias NullString `json:"alias"`
}
