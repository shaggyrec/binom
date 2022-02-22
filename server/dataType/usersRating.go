package dataType

type UserRating struct {
	Username      string `json:"username"`
	Name          string `json:"name"`
	Score         int    `json:"score"`
	LessonsPassed int    `json:"lessonsPassed"`
}
