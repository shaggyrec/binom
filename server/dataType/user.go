package dataType

import (
	"github.com/go-pg/pg"
)

type User struct {
	Id string `json:"id"`
	Email NullString `json:"email"`
	Name NullString `json:"name"`
	Created pg.NullTime `json:"created"`
	Username NullString `json:"username"`
	Phone NullString `json:"-"`
}
