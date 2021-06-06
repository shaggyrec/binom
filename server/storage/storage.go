package storage

import "github.com/go-pg/pg"

type Storage interface {
	Init()
	Create() string
	Update()
	Delete()
}

type Factory struct {
	AuthCode AuthCodeStorage
}

func AuthCode(db *pg.DB) *AuthCodeStorage {
	storage := AuthCodeStorage{}
	storage.Init(db)
	return &storage
}