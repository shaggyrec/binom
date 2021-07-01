package storage

import (
	"binom/server/dataType"
	"errors"
	"github.com/go-pg/pg"
)

type LessonCommentStorage struct {
	db *pg.DB
}

func (s *LessonCommentStorage) Init(db *pg.DB) {
	s.db = db
}

func (s *LessonCommentStorage) Create(comment *dataType.LessonComment) (*dataType.LessonComment, error) {
	_, err := s.db.Model(comment).Insert()

	return comment, err
}

func (s *LessonCommentStorage) Update(comment *dataType.LessonComment) (*dataType.LessonComment, error) {
	r, err := s.db.Model(comment).WherePK().Update()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}
	return comment, err
}

func (s *LessonCommentStorage) Delete(id string) error {
	lc := dataType.LessonComment{Id: id}
	r, err := s.db.Model(&lc).WherePK().Delete()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}

	return err
}

func (s *LessonCommentStorage) AddFile(file *dataType.LessonCommentFile) (*dataType.LessonCommentFile, error) {
	_, err := s.db.Model(file).Insert()

	return file, err
}

func (s *LessonCommentStorage) DeleteFile(fileId string) error {
	f := dataType.LessonCommentFile{Id: fileId}
	r, err := s.db.Model(&f).WherePK().Delete()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}

	return err
}
