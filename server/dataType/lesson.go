package dataType

import (
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
)

type Lesson struct {
	Id string `json:"id"`
	TopicId string `json:"topicId"`
	Name null.String `json:"name"`
	Created pg.NullTime `json:"created"`
	Text null.String `json:"text"`
	Pos null.Int `json:"pos"`
	Task null.String `json:"task"`
	Video null.String `json:"video"`
	Alias null.String `json:"alias"`
}
