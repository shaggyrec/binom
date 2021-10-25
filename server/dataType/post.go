package dataType

import (
	"github.com/go-pg/pg"
)

type Post struct {
	Id string `json:"id"`
	User User `json:"user"`
	UserId string `json:"userId"`
	Text string `json:"text"`
	LikesAmount int `json:"likesAmount" pg:"-"`
	Likes []string `json:"-"`
	Created pg.NullTime `json:"created"`
	Updated pg.NullTime `json:"updated"`
	Images []string `json:"images"`
	Comments []PostComment `json:"comments"`
	CommentsAmount int `pg:"-" json:"commentsAmount"`
}
