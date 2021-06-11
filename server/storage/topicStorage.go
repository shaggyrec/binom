package storage

import (
	"binom/server/dataType"
	"errors"
	"github.com/go-pg/pg"
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

func (s *TopicStorage) List(limit int, offset int) ([]*dataType.Topic, error) {
	var topics []*dataType.Topic
	err := s.db.Model(topics).Limit(limit).Offset(offset).OrderExpr("pos ASC created desc").Select()

	return topics, err
}

func (s *TopicStorage) GetById(id string) (*dataType.Topic, error) {
	topic := &dataType.Topic{Id: id}
	err := s.db.Model(topic).WherePK().Select()

	return topic, err
}

func (s *TopicStorage) GetByAlias(alias string) (*dataType.Topic, error) {
	topic := &dataType.Topic{Alias: dataType.NullString{String: alias, Valid: true}}
	err := s.db.Model(topic).Where("alias = ?", alias).Select()

	return topic, err
}

func (s *TopicStorage) Delete(topic *dataType.Topic) (*dataType.Topic, error) {
	_, err := s.db.Model(topic).WherePK().Delete()

	return topic, err
}