package storage

import (
	"binom/server/dataType"
	"database/sql"
	"github.com/go-pg/pg"
)

type AuthCodeStorage struct {
	db *pg.DB
}

func (s *AuthCodeStorage) Init(db *pg.DB) {
	s.db = db
}

func (s *AuthCodeStorage) Create(code *dataType.AuthCode) *dataType.AuthCode {
	_, err := s.db.Model(code).Insert()
	if err != nil {
		panic(err)
	}

	return code
}

func (s *AuthCodeStorage) Update ()  {
	panic("Can't update code")
}

func (s *AuthCodeStorage) Delete ()  {
	panic("Can't update code")
}

func (s *AuthCodeStorage) Invalidate(code *dataType.AuthCode) {
	code.Valid = sql.NullBool{Bool: false, Valid: true}
	_, err := s.db.Model(code).WherePK().Update()
	if err != nil {
		panic(err)
	}
}

func (s *AuthCodeStorage) Get(id string) *dataType.AuthCode {
	authCode := &dataType.AuthCode{ Id: id }
	err := s.db.Model(authCode).WherePK().Select()

	if err != nil {
		panic(err)
	}

	return authCode
}

func (s *AuthCodeStorage) GetLastCodeOfRecipient(r string) *dataType.AuthCode {
	authCode := &dataType.AuthCode{ Recipient: r }
	err := s.db.Model(authCode).Where("recipient = ? AND valid = TRUE", r).Select()
	switch err {
	case pg.ErrNoRows:
		return nil
	case nil:
		return authCode
	default:
		panic(err)
	}

	return authCode
}