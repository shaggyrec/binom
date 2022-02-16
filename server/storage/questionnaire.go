package storage

import (
	"binom/server/dataType"
	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"
)

type QuestionnaireStorage struct {
	db *pg.DB
}

func (s *QuestionnaireStorage) Init(db *pg.DB) {
	s.db = db
}

func (s *QuestionnaireStorage) ById(id string) (*dataType.Questionnaire, error) {
	q := dataType.Questionnaire{Id: id}
	err := s.db.Model(&q).Relation("Questions", func(q *orm.Query) (*orm.Query, error) {
		return q.OrderExpr("question.created ASC"), nil
	}).WherePK().Select()

	return &q, err
}

func (s *QuestionnaireStorage) StoreAnswer(answer *dataType.Answer) error {
	_, err := s.db.Model(answer).Insert()

	return err
}
