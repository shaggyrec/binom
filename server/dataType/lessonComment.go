package dataType

import (
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
)

type LessonComment struct {
	Id string `json:"id"`
	LessonId string `json:"lessonId"`
	User string `json:"user"`
	Text null.String `json:"text"`
	Author string `json:"author"`
	Updated pg.NullTime `json:"updated"`
	Created pg.NullTime `json:"created"`
	Files []*LessonCommentFile `pg:"rel:has-many" json:"files"`
}
