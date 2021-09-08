package dataType

import (
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
)

const NotificationInfo = 1
const NotificationLessonComment = 2
const NotificationFeedComment = 3
const NotificationLessonProgressChanged = 4
const NotificationSubscriptionActivate =  5

type Meta struct {
	Lesson string `json:"lesson"`
	Post string `json:"post"`
	Comment string `json:"comment"`
}

type Notification struct {
	Id string `json:"id"`
	Message string `json:"message"`
	Type null.Int `json:"type"`
	Created pg.NullTime `json:"created"`
	Meta Meta `json:"meta"`
	AuthorId string `json:"-"`
	Author *User `pg:"rel:has-one" json:"author"`
}
