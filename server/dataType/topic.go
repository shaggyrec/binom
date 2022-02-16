package dataType

import (
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
)

type Topic struct {
	Id       string      `json:"id"`
	Name     null.String `json:"name"`
	Created  pg.NullTime `json:"created"`
	Text     null.String `json:"text"`
	Pos      null.Int    `json:"pos"`
	Alias    null.String `json:"alias"`
	Lessons  []Lesson    `pg:"rel:has-many" json:"lessons"`
	Status   *UserTopic  `pg:"rel:has-one" json:"status"`
	OpenDate null.String `json:"openDate"`
	CourseId string      `json:"courseId"`
}

type UserTopic struct {
	UserId   string `json:"userId"`
	TopicId  string `json:"topicId"`
	LessonId string `json:"lessonId"`
	Created  string `json:"created"`
	Finished string `json:"finished"`
	Updated  string `json:"updated"`
}
