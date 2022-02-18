package storage

import (
	"binom/server/dataType"
	"binom/server/functions"
	"database/sql"
	"errors"
	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"
	"github.com/mitchellh/mapstructure"
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

func (s *TopicStorage) Update(id string, topicMap map[string]interface{}) error {
	r, err := s.db.Model(s.mapDbRow(topicMap)).
		Column(functions.ArrayToSnakeCase(functions.MapKeys(topicMap))...).
		Where("id = ?", id).
		Update()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}
	return err
}

func (s *TopicStorage) List(limit int, offset int, withLessons bool, userId string) (*[]dataType.Topic, error) {
	var topics []dataType.Topic
	stmt := s.db.Model(&topics).Relation("Course")
	if withLessons {
		stmt.Relation("Lessons", func(q *orm.Query) (*orm.Query, error) {
			return q.Column("lesson.id", "lesson.name", "lesson.topic_id", "lesson.alias").OrderExpr("lesson.pos ASC, lesson.created ASC"), nil
		})
	}

	if userId != "" {
		stmt.Relation("Status", func(q *orm.Query) (*orm.Query, error) {
			return q.JoinOn("status.user_id = ?", userId), nil
		})
	}

	stmt.Limit(limit).
		Offset(offset).
		OrderExpr("pos ASC, created ASC")

	err := stmt.Select()
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

func (s *TopicStorage) Delete(id string) error {
	topic := &dataType.Topic{Id: id}
	r, err := s.db.Model(topic).WherePK().Delete()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}

	return err
}

func (s *TopicStorage) Count() int {
	var topics []dataType.Topic
	amount, err := s.db.Model(&topics).Count()

	if err != nil {
		return 0
	}
	return amount
}

func (s *TopicStorage) mapDbRow(data map[string]interface{}) *dataType.Topic {
	var topic dataType.Topic
	mapstructure.Decode(data, &topic)

	if val, ok := data["name"]; ok {
		topic.Name.String = val.(string)
		topic.Name.Valid = true
	}

	if val, ok := data["text"]; ok && val != nil {
		topic.Text.String = val.(string)
		topic.Text.Valid = true
	}

	if val, ok := data["alias"]; ok {
		topic.Alias.String = val.(string)
		topic.Alias.Valid = true
	}

	if val, ok := data["openDate"]; ok {
		topic.OpenDate.String = val.(string)
		topic.OpenDate.Valid = true
	}

	return &topic
}
