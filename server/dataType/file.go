package dataType

import "github.com/go-pg/pg"

type File struct {
	Id string `json:"id"`
	UserId string `json:"userId"`
	Name string `json:"name"`
	Extension string `json:"extension"`
	Type string `json:"type"`
	Created pg.NullTime `json:"created"`
}
