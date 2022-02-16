package storage

import (
	"binom/server/dataType"
	"github.com/go-pg/pg"
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
		Relation("Topics").
		Select()

	return course, err
}
