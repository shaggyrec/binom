package storage

import (
	"binom/server/dataType"
	"github.com/go-pg/pg"
)

type UtmStorage struct {
	db *pg.DB
}

func (s *UtmStorage) Init(db *pg.DB) {
	s.db = db
}

func (s *UtmStorage) Create(utm *dataType.Utm) (*dataType.Utm, error) {
	_, err := s.db.Model(utm).Insert()

	return utm, err
}

func (s *UtmStorage) Update(utm *dataType.Utm) (*dataType.Utm, error) {
	_, err := s.db.Model(utm).WherePK().Update()

	return utm, err
}

func (s *UtmStorage) ById(id string) (*dataType.Utm, error) {
	var utm = dataType.Utm{Id: id}
	err := s.db.Model(&utm).WherePK().Select()
	if err != nil {
		return nil, err
	}
	return &utm, nil
}
