package service

import (
	"binom/server/storage"
	"fmt"
	"math"
	"time"
)

type UserScoreService struct {
	userStorage *storage.UserStorage
	lessonStorage *storage.LessonStorage
	pointsMovementStorage *storage.PointsMovementStorage
}

func (s *UserScoreService) Init(lessonStorage *storage.LessonStorage, userStorage *storage.UserStorage, pointsMovementStorage *storage.PointsMovementStorage)  {
	s.lessonStorage = lessonStorage
	s.userStorage = userStorage
	s.pointsMovementStorage = pointsMovementStorage
}

func (s *UserScoreService) AddScoreForTheLesson(lessonId, userId string, percentTask float64, dateStart time.Time) int {
	lesson, _ := s.lessonStorage.GetById(lessonId)
	user, _ := s.userStorage.Get(userId)

	koef := 1.
	if dateStart.AddDate(0, 0, lesson.Deadline).Before(time.Now()) {
		koef = .5
	}

	pointsToAdd := int(math.Ceil(float64(lesson.TaskValue.Int64) * koef * percentTask))

	s.pointsMovementStorage.Store(
		userId,
		pointsToAdd,
		fmt.Sprintf("Баллы за урок %s", lesson.Name.String),
	)

	user.Score = user.Score + pointsToAdd
	user.Points = user.Points + pointsToAdd

	s.userStorage.Update(user)

	return pointsToAdd
}
