package storage

import (
	"binom/server/dataType"
	"github.com/go-pg/pg"
)

type TransactionStorage struct {
	db *pg.DB
}

func (s *TransactionStorage) Init(db *pg.DB) {
	s.db = db
}

func (s *TransactionStorage) Store(t *dataType.Transaction) (*dataType.Transaction, error) {
	_, err := s.db.Model(t).Insert()

	return t, err
}
