package dataType

import "github.com/go-pg/pg"

type LessonCommentFile struct {
	Id string `json:"id"`
	LessonCommentId string `json:"lesson_comment"`
	File File `pg:"rel:has-one" json:"file"`
	Created pg.NullTime `json:"created"`
}
