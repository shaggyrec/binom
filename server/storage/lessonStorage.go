package storage

import (
	"binom/server/dataType"
	"binom/server/functions"
	"errors"
	"github.com/go-pg/pg"
	"github.com/mitchellh/mapstructure"
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

func (s *LessonStorage) Update(id string, lessonMap map[string]interface{}) error {
	r, err := s.db.Model(s.mapDbRow(lessonMap)).
		Column(functions.ArrayToSnakeCase(functions.MapKeys(lessonMap))...).
		Where("id = ?", id).
		Update()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}
	return err
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
	err := s.db.Model(l).Relation("Topic").Where("lesson.alias = ?", alias).Select()

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

func (s *LessonStorage) mapDbRow(data map[string]interface{}) *dataType.Lesson {
	var lesson dataType.Lesson
	mapstructure.Decode(data, &lesson)

	if val, ok := data["name"]; ok {
		lesson.Name.String = val.(string)
		lesson.Name.Valid = true
	}

	if val, ok := data["text"]; ok && val != nil {
		lesson.Text.String = val.(string)
		lesson.Text.Valid = true
	}

	if val, ok := data["task"]; ok && val != nil {
		lesson.Task.String = val.(string)
		lesson.Task.Valid = true
	}

	if val, ok := data["alias"]; ok {
		lesson.Alias.String = val.(string)
		lesson.Alias.Valid = true
	}

	if val, ok := data["taskValue"]; ok {
		lesson.TaskValue.Int64 = int64(val.(float64))
		lesson.TaskValue.Valid = true
	}

	return &lesson
}

func (s *LessonStorage) Count() int {
	var lessons []dataType.Lesson
	amount, err := s.db.Model(&lessons).Count()
	if err != nil {
		return 0
	}
	return amount

}
