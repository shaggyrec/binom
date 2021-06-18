package dataType

import (
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
)

const UserRoleAdmin = 1
const UserRoleUser = 0

type User struct {
	Id string `json:"id"`
	Email null.String `json:"email"`
	Name null.String `json:"name"`
	Created pg.NullTime `json:"created"`
	Username null.String `json:"username"`
	Phone null.String `json:"-"`
	Role null.Int `json:"role"`
}
