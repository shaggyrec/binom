package dataType

import (
	"github.com/go-pg/pg"
)

type PostComment struct {
	Id string `json:"id"`
	User User `json:"user"`
	UserId string `json:"userId"`
	PostId string `json:"postId"`
	Text string `json:"text"`
	//LikesAmount int `json:"likesAmount"`
	Created pg.NullTime `json:"created"`
	Updated pg.NullTime `json:"updated"`
}
