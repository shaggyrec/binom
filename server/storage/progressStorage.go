package storage

import (
	"binom/server/dataType"
	"github.com/go-pg/pg"
	"time"
)

type ProgressStorage struct {
	db *pg.DB
}

func (s *ProgressStorage) Init(db *pg.DB) {
	s.db = db
}

func (s *ProgressStorage) ByLessonId(lessonId, userId string) (*dataType.Progress, error) {
	var p dataType.Progress
	err := s.db.Model(&p).Where("lesson_id = ? AND user_id = ?", lessonId, userId).Select()
	return &p, err
}

func (s *ProgressStorage) Store(lessonId, userId string) (*dataType.Progress, error) {
	p := dataType.Progress{LessonId: lessonId, UserId: userId}
	_, err := s.db.Model(&p).Insert()

	return &p, err
}

func (s *ProgressStorage) MakeFinished(lessonId, userId string) (*dataType.Progress, error) {
	p := dataType.Progress{LessonId: lessonId, UserId: userId, Finished: pg.NullTime{Time: time.Now()}}
	_, err := s.db.Model(&p).
		Where("lesson_id = ? AND user_id = ?", lessonId, userId).
		Column("finished").
		Update()

	return &p, err
}

func (s *ProgressStorage) SetScore(lessonId, userId, score string) (*dataType.Progress, error) {
	p := dataType.Progress{LessonId: lessonId, UserId: userId, Score: score}
	_, err := s.db.Model(&p).
		Where("lesson_id = ? AND user_id = ?", lessonId, userId).
		Column("score").
		Update()

	return &p, err
}
