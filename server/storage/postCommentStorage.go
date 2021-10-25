package storage

import (
	"binom/server/dataType"
	"github.com/go-pg/pg"
)

type PostCommentStorage struct {
	db *pg.DB
}

func (s *PostCommentStorage) Init(db *pg.DB) {
	s.db = db
}

func (s *PostCommentStorage) Create(comment *dataType.PostComment) (*dataType.PostComment, error) {
	_, err := s.db.Model(comment).Insert()

	return comment, err
}

func (s *PostCommentStorage) ByPostId(postId string, limit, offset int) *[]dataType.PostComment {
	var comments []dataType.PostComment

	s.db.Model(&comments).
		Where("post_id = ?", postId).
		Limit(limit).Offset(offset).
		OrderExpr("created DESC").
		Select()

	return &comments
}
