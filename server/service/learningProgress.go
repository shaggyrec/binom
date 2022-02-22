package service

import (
	"binom/server/dataType"
	"binom/server/storage"
	"errors"
	"github.com/go-pg/pg"
)

type topicProgress struct {
	Id       string
	Started  bool
	Finished bool
	Score    string
}

type ProgressService struct {
	db              *pg.DB
	progressStorage *storage.ProgressStorage
}

func (s *ProgressService) Init(db *pg.DB, progressStorage *storage.ProgressStorage) {
	s.db = db
	s.progressStorage = progressStorage
}

func (s *ProgressService) AssertLessonAllowed(lesson *dataType.Lesson, userId string) error {
	p, err := s.progressStorage.ByLessonId(lesson.Id, userId)
	if err == nil && p.Id != "" {
		return nil
	}

	progressByTopicLessons, err := s.progressByTopic(lesson.TopicId, userId)

	if err != nil {
		return err
	}

	prevIsFinished := false
	for i, p := range *progressByTopicLessons {
		if p.Id == lesson.Id {
			if i == 0 || prevIsFinished {
				_, err = s.progressStorage.Store(lesson.Id, userId)
				return err
			}
			return errors.New("необходимо пройти предыдущие уроки")
		}
		prevIsFinished = p.Finished
	}

	return errors.New("необходимо пройти предыдущие уроки")
}

func (s *ProgressService) IsTopicFinished(topicId, userId string) bool {
	progressByTopicLessons, err := s.progressByTopic(topicId, userId)

	if err != nil {
		return false
	}

	for _, p := range *progressByTopicLessons {
		if p.Score == "" {
			return false
		}
	}
	return true
}

func (s *ProgressService) progressByTopic(topicId, userId string) (*[]topicProgress, error) {
	var p []topicProgress
	_, err := s.db.Query(
		&p,
		`SELECT
			l.id, 
			CASE WHEN p.created IS NOT NULL THEN true ELSE FALSE END as started,
			CASE WHEN p.finished IS NOT NULL THEN true ELSE FALSE END as finished,
			p.score
				FROM lessons l
					LEFT JOIN progresses p ON p.lesson_id = l.id AND p.user_id = ?
		WHERE l.topic_id = ?
		ORDER BY l.pos ASC, l.created ASC
		`,
		userId,
		topicId,
	)

	return &p, err
}
