package dataType

import (
	"database/sql"
	"github.com/go-pg/pg"
)

type User struct {
	Id string
	Email sql.NullString
	Name sql.NullString
	Created pg.NullTime
	Username sql.NullString
	Phone sql.NullString
}
