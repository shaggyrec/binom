package storage

import (
	"binom/server/dataType"
	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"
)

type CourseStorage struct {
	db *pg.DB
}

func (s *CourseStorage) Init(db *pg.DB) {
	s.db = db
}

func (s *CourseStorage) GetById(id string) (*dataType.Course, error) {
	course := &dataType.Course{Id: id}
	err := s.db.Model(course).WherePK().
		Relation("Topics", func(query *orm.Query) (*orm.Query, error) {
			return query.OrderExpr("topic.pos ASC, topic.created ASC"), nil
		}).
		Relation("Topics.Course").
		Relation("Topics.Lessons", func(query *orm.Query) (*orm.Query, error) {
			return query.Column("lesson.id", "lesson.name", "lesson.topic_id", "lesson.alias").OrderExpr("lesson.pos ASC, lesson.created ASC"), nil
		}).
		Select()

	return course, err
}

func (s *CourseStorage) List() (*[]dataType.Course, error) {
	var courses []dataType.Course

	err := s.db.Model(&courses).OrderExpr("id DESC").Select()

	return &courses, err
}
