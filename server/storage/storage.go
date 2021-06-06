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
	AuthCode AuthCodeStorage
}

func AuthCode(db *pg.DB) *AuthCodeStorage {
	storage := AuthCodeStorage{}
	storage.Init(db)
	return &storage
}

func User(db *pg.DB) *UserStorage {
	storage := UserStorage{}
	storage.Init(db)
	return &storage
}