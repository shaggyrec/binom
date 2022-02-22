package dataType

import "github.com/go-pg/pg"

type Progress struct {
	Id       string      `json:"id"`
	UserId   string      `json:"userId"`
	LessonId string      `json:"lessonId"`
	Lesson   *Lesson     `json:"lesson"`
	Score    string      `json:"score"`
	Created  pg.NullTime `json:"created"`
	Finished pg.NullTime `json:"finished"`
}
