package dataType

import (
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
)

const UserRoleAdmin = 2
const UserRoleUser = 1

type User struct {
	Id string `json:"id"`
	Email null.String `json:"email"`
	Name null.String `json:"name"`
	Created pg.NullTime `json:"created"`
	Username null.String `json:"username"`
	Phone null.String `json:"-"`
	Role null.Int `json:"role"`
	Subscription *UserSubscription `pg:"rel:has-many" json:"subscription"`
}
