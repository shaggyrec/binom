package storage

import (
	"binom/server/dataType"
	"binom/server/functions"
	"errors"
	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"
	"github.com/mitchellh/mapstructure"
	"time"
)

type PostStorage struct {
	db *pg.DB
}

func (s *PostStorage) Init(db *pg.DB) {
	s.db = db
}

func (s *PostStorage) Create(post *dataType.Post) (*dataType.Post, error) {
	_, err := s.db.Model(post).Insert()

	p, _ := s.ById(post.Id)

	return p, err
}

func (s *PostStorage) Update(id string, postMap map[string]interface{}) error {
	postMap["updated"] = time.Now()
	r, err := s.db.Model(s.mapDbRow(postMap)).
		Column(functions.ArrayToSnakeCase(functions.MapKeys(postMap))...).
		Where("id = ?", id).
		Update()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}
	return err
}

func (s *PostStorage) Delete(id string) error {
	l := &dataType.Post{Id: id}
	r, err := s.db.Model(l).WherePK().Delete()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}

	return err
}

func (s *PostStorage) ById(id string) (*dataType.Post, error) {
	p := dataType.Post{Id: id}
	err := s.db.Model(&p).
		WherePK().
		Relation("User", func(query *orm.Query) (*orm.Query, error) {
			return query.Column("User.id", "User.username", "User.name"), nil
		}).
		Select()

	if err != nil {
		return nil, err
	}

	return &p, err
}

func (s *PostStorage) mapDbRow(data map[string]interface{}) *dataType.Post {
	var post dataType.Post
	mapstructure.Decode(data, &post)

	return &post
}
