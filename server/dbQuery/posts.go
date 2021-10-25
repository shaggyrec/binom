package dbQuery

import (
	"binom/server/dataType"
	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"
)

type PostsDbQuery struct {
	db *pg.DB
	stmp *orm.Query
	posts []dataType.Post
}

func (q *PostsDbQuery) Init(db *pg.DB)  {
	q.db = db
	q.stmp = q.listDbQuery()
}

func (q *PostsDbQuery) Limit(limit int) *PostsDbQuery {
	q.stmp.Limit(limit)

	return q
}

func (q *PostsDbQuery) Offset(offset int) *PostsDbQuery {
	q.stmp.Offset(offset)

	return q
}

func (q *PostsDbQuery) UserId(userId string) *PostsDbQuery {
	q.stmp.Where("user_id = ?", userId)

	return q
}

func (q *PostsDbQuery) Username(username string) *PostsDbQuery {
	q.stmp.Where("user.username = ?", username)

	return q
}

func (q *PostsDbQuery) Get() (*[]dataType.Post, error) {
	err := q.stmp.Select()

	return &q.posts, err
}

func (q *PostsDbQuery) listDbQuery() *orm.Query {
	return q.db.Model(&q.posts).
		Relation("User").
		OrderExpr("created DESC")
}
