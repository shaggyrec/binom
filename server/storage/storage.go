package storage

import "github.com/go-pg/pg"

type Storage interface {
	Init()
	Create() interface{}
	Update()
	Delete()
	Get() interface{}
}

type Factory struct {
}

func (f *Factory) AuthCode(db *pg.DB) *AuthCodeStorage {
	storage := AuthCodeStorage{}
	storage.Init(db)
	return &storage
}

func (f *Factory) User(db *pg.DB) *UserStorage {
	storage := UserStorage{}
	storage.Init(db)
	return &storage
}

func (f *Factory) Token(db *pg.DB) *TokenStorage {
	storage := TokenStorage{}
	storage.Init(db)
	return &storage
}