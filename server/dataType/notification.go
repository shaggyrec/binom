package dataType

import (
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
)

const NotificationInfo = 1
const NotificationLessonComment = 2
const NotificationFeedComment = 3

type Meta struct {
	Lesson string `json:"lesson"`
	User string `json:"user"`
	Post string `json:"post"`
}

type Notification struct {
	Id string `json:"id"`
	Message string `json:"message"`
	Type null.Int `json:"type"`
	Created pg.NullTime `json:"created"`
	Meta Meta `json:"meta"`
}
