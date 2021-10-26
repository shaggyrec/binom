package dbQuery

import "github.com/go-pg/pg"

func Posts(db *pg.DB) *PostsDbQuery {
	q := &PostsDbQuery{}
	q.Init(db)

	return q
}
