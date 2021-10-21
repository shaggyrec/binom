package dataType

import "gopkg.in/guregu/null.v4"

type Post struct {
	Id string `json:"id"`
	User User `json:"user"`
	TopicId string `json:"topicId"`
	Text string `json:"text"`
	LikesAmount int `json:"likesAmount"`
	Created null.Time `json:"created"`
	Updated null.Time `json:"updated"`
	Images []string `json:"images"`
	Comments []PostComment `json:"comments"`
}
