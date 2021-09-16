package dataType

type UserRating struct {
	Username string `json:"username"`
	Name string `json:"name"`
	Score int `json:"score"`
	TopicsPassed int `json:"topicsPassed"`
}
