package storage

import (
	"binom/server/dataType"
	"database/sql"
	"errors"
	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"
	"gopkg.in/guregu/null.v4"
)

type TopicStorage struct {
	db *pg.DB
}

func (s *TopicStorage) Init(db *pg.DB) {
	s.db = db
}

func (s *TopicStorage) Create(topic *dataType.Topic) (*dataType.Topic, error) {
	_, err := s.db.Model(topic).Insert()

	return topic, err
}

func (s *TopicStorage) Update(topic *dataType.Topic) (*dataType.Topic, error) {
	r, err := s.db.Model(topic).WherePK().Update()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}
	return topic, err
}

func (s *TopicStorage) List(limit int, offset int, withLessons bool) (*[]dataType.Topic, error) {
	var topics []dataType.Topic
	err := s.db.Model(&topics).
		Relation("Lessons", func (q *orm.Query) (*orm.Query, error) {
			return q.Order("lesson.pos ASC"), nil
		}).
		Limit(limit).
		Offset(offset).
		OrderExpr("pos ASC, created DESC").
		Select()

	return &topics, err
}

func (s *TopicStorage) GetById(id string) (*dataType.Topic, error) {
	topic := &dataType.Topic{Id: id}
	err := s.db.Model(topic).WherePK().Select()

	return topic, err
}

func (s *TopicStorage) GetByAlias(alias string) (*dataType.Topic, error) {
	topic := &dataType.Topic{Alias: null.String{NullString: sql.NullString{String: alias, Valid: true}}}
	err := s.db.Model(topic).Where("alias = ?", alias).Select()

	return topic, err
}

func (s *TopicStorage) Delete(id string) (error) {
	topic := &dataType.Topic{Id: id}
	r, err := s.db.Model(topic).WherePK().Delete()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}

	return err
}