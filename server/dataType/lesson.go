package dataType

import "github.com/go-pg/pg"

type Lesson struct {
	Id string `json:"id"`
	TopicId string `json:"topicId"`
	Name NullString `json:"name"`
	Created pg.NullTime `json:"created"`
	Text NullString `json:"text"`
	Pos NullInt `json:"pos"`
	Task NullString `json:"task"`
	Video NullString `json:"video"`
	Alias NullString `json:"alias"`
}
