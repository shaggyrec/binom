package dataType

import (
	"database/sql"
	"github.com/go-pg/pg"
)

type User struct {
	Id string `json:"id"`
	Email sql.NullString `json:"email"`
	Name sql.NullString `json:"name"`
	Created pg.NullTime `json:"created"`
	Username sql.NullString `json:"username"`
	Phone sql.NullString `json:"-"`
}
