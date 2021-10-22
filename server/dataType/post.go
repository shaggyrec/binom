package dataType

import "gopkg.in/guregu/null.v4"

type Post struct {
	Id string `json:"id"`
	User User `json:"user"`
	UserId string `json:"userId"`
	Text string `json:"text"`
	//LikesAmount int `json:"likesAmount"`
	Likes []string `json:"-"`
	Created null.Time `json:"created"`
	Updated null.Time `json:"updated"`
	Images []string `json:"images"`
	//Comments []PostComment `json:"comments"`
}
