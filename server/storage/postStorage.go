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

	return post, err
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
	err := s.db.Model(&p).WherePK().Select()

	if err != nil {
		return nil, err
	}

	return &p, err
}

func (s *PostStorage) List(limit int, offset int) (*[]dataType.Post, error) {
	var posts []dataType.Post
	err := s.listDbQuery(&posts, limit, offset).
		Select()

	return &posts, err
}

func (s *PostStorage) ListByUserId(userId string, limit int, offset int) (*[]dataType.Post, error) {
	var posts []dataType.Post
	err := s.listDbQuery(&posts, limit, offset).
		Where("user_id = ?", userId).
		Select()

	return &posts, err
}

func (s* PostStorage) ListByUsername(username string, limit int, offset int) (*[]dataType.Post, error) {
	var posts []dataType.Post
	err := s.listDbQuery(&posts, limit, offset).
		Where("user.username = ?", username).
		Select()

	return &posts, err
}

func (s *PostStorage) listDbQuery(posts *[]dataType.Post, limit, offset int) *orm.Query {
	return s.db.Model(posts).
		Relation("user").
		Limit(limit).
		Offset(offset).
		OrderExpr("created DESC")
}

func (s *PostStorage) mapDbRow(data map[string]interface{}) *dataType.Post {
	var post dataType.Post
	mapstructure.Decode(data, &post)

	return &post
}
