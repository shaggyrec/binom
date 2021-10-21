package service

import (
	"binom/server/dataType"
	"binom/server/storage"
	"fmt"
	"github.com/go-pg/pg"
	"math"
	"time"
)

type UserScoreService struct {
	userStorage *storage.UserStorage
	lessonStorage *storage.LessonStorage
	pointsMovementStorage *storage.PointsMovementStorage
	db *pg.DB
}

func (s *UserScoreService) Init(lessonStorage *storage.LessonStorage, userStorage *storage.UserStorage, pointsMovementStorage *storage.PointsMovementStorage, db *pg.DB)  {
	s.lessonStorage = lessonStorage
	s.userStorage = userStorage
	s.pointsMovementStorage = pointsMovementStorage
	s.db = db
}

func (s *UserScoreService) AddScoreForTheLesson(lessonId, userId string, percentTask float64, dateStart time.Time) int {
	lesson, _ := s.lessonStorage.GetById(lessonId)
	user, _ := s.userStorage.Get(userId)

	koef := 1.
	if dateStart.AddDate(0, 0, lesson.Deadline + 1).Before(time.Now()) {
		koef = .5
	}

	pointsToAdd := int(math.Ceil(float64(lesson.TaskValue.Int64) * koef * percentTask))

	s.pointsMovementStorage.Store(
		userId,
		pointsToAdd,
		fmt.Sprintf("Баллы за урок %s", lesson.Name.String),
	)

	s.userStorage.Update(userId, map[string]interface{}{"score": user.Score + pointsToAdd, "points": user.Points + pointsToAdd})

	return pointsToAdd
}

func (s *UserScoreService) UsersRatingByYear(year int) []dataType.UserRating {

	var r []dataType.UserRating

	s.db.Query(
		&r,
		`SELECT
			u.username, u.name, u.score, COUNT(ut.*) as topics_passed
		FROM users u
			LEFT JOIN user_topics ut ON ut.user_id = u.id
		WHERE ut.updated BETWEEN make_date(?, 7, 1) AND make_date(?, 6, 1)
		GROUP BY u.username, u.name, u.score
		ORDER BY u.score DESC`,
		year,
		year + 1,
	)

	return r
}
