package storage

import (
	"binom/server/dataType"
	"errors"
	"github.com/go-pg/pg"
)

type FileStorage struct {
	db *pg.DB
}

func (s *FileStorage) Init(db *pg.DB) {
	s.db = db
}

func (s *FileStorage) Create(file *dataType.File) (*dataType.File, error) {
	_, err := s.db.Model(file).Insert()

	return file, err
}

func (s *FileStorage) Delete(id string) error {
	f := dataType.File{Id: id}
	r, err := s.db.Model(&f).WherePK().Delete()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}

	return err
}

func (s *FileStorage) Get(id string) (*dataType.File, error) {
	f := &dataType.File{Id: id}

	err := s.db.Model(f).WherePK().Select()

	return f, err
}
