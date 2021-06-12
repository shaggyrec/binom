package storage

import (
	"binom/server/dataType"
	"errors"
	"github.com/go-pg/pg"
)

type LessonStorage struct {
	db *pg.DB
}

func (s *LessonStorage) Init(db *pg.DB) {
	s.db = db
}

func (s *LessonStorage) Create(lesson *dataType.Lesson) (*dataType.Lesson, error) {
	_, err := s.db.Model(lesson).Insert()

	return lesson, err
}

func (s *LessonStorage) Update(lesson *dataType.Lesson) (*dataType.Lesson, error) {
	r, err := s.db.Model(lesson).WherePK().Update()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}
	return lesson, err
}

func (s *LessonStorage) Delete(id string) error {
	l := &dataType.Lesson{Id: id}
	r, err := s.db.Model(l).WherePK().Delete()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}

	return err
}

func (s *LessonStorage) GetById(id string) (*dataType.Lesson, error) {
	l := &dataType.Lesson{Id: id}
	err := s.db.Model(l).WherePK().Select()

	return l, err
}

func (s *LessonStorage) GetByAlias(alias string) (*dataType.Lesson, error) {
	var l = &dataType.Lesson{}
	err := s.db.Model(l).Where("alias = ?", alias).Select()

	return l, err
}

func (s *LessonStorage) List(limit int, offset int) (*[]dataType.Lesson, error) {
	var lessons []dataType.Lesson
	err := s.db.Model(&lessons).Limit(limit).Offset(offset).OrderExpr("pos ASC, created DESC").Select()

	return &lessons, err
}

func (s *LessonStorage) ListByTopic(topicId string, limit int, offset int) (*[]dataType.Lesson, error) {
	var lessons []dataType.Lesson
	err := s.db.Model(&lessons).Where("topic = ?", topicId).Limit(limit).Offset(offset).OrderExpr("pos ASC, created DESC").Select()

	return &lessons, err
}