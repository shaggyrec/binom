package storage

import (
	"binom/server/dataType"
	"github.com/go-pg/pg"
)

type SentEmailStorage struct {
	db *pg.DB
}

func (s *SentEmailStorage) Init (db *pg.DB)  {
	s.db = db
}

func (s *SentEmailStorage) Create(email *dataType.SentEmail) (*dataType.SentEmail, error) {
	_, err := s.db.Model(email).Insert()

	return email, err
}
