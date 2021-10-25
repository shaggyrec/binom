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

func (q *PostsDbQuery) WithComments(limit int) *PostsDbQuery {
	q.stmp.Relation("Comments", func(query *orm.Query) (*orm.Query, error) {
		return query.OrderExpr("created DESC").Limit(limit), nil
	}).Relation("Comments.User", func(query *orm.Query) (*orm.Query, error) {
		return query.Column("Comments.User.id", "Comments.User.username", "Comments.User.name"), nil
	}).ColumnExpr("(SELECT count(id) FROM post_comments WHERE post_id = Post.id) as comments_amount")

	return q
}

func (q *PostsDbQuery) Get() (*[]dataType.Post, error) {
	err := q.stmp.Select()

	return &q.posts, err
}

func (q *PostsDbQuery) listDbQuery() *orm.Query {
	return q.db.Model(&q.posts).
		ColumnExpr("Post.*").
		ColumnExpr("jsonb_array_length(Post.likes) as likes_amount").
		Relation("User", func(query *orm.Query) (*orm.Query, error) {
			return query.Column("User.id", "User.username", "User.name"), nil
		}).OrderExpr("Post.created DESC")
}
