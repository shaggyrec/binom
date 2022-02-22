package storage

import (
	"binom/server/dataType"
	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"
)

type CourseStorage struct {
	db *pg.DB
}

func (s *CourseStorage) Init(db *pg.DB) {
	s.db = db
}

func (s *CourseStorage) GetById(id, userId string) (*dataType.Course, error) {
	course := &dataType.Course{Id: id}
	q := s.db.Model(course).WherePK().
		Relation("Topics", func(query *orm.Query) (*orm.Query, error) {
			return query.ColumnExpr("topic.*").
				ColumnExpr(`(SELECT CASE
    WHEN count(l.id) = count(p.finished)
        THEN 'finished'
    WHEN
        count(p.created) > 0
        THEN 'started'
    WHEN
       	topic.price = 0 OR MAX(us.created) IS NOT NULL
        THEN 'available'
    ELSE 'unavailable'
   END
FROM lessons l
LEFT JOIN progresses p ON p.lesson_id = l.id AND p.user_id = ?
LEFT JOIN user_subscriptions us ON us.user_id = ? AND us.status = 1 AND us.topics ? topic.id::text
WHERE l.topic_id = topic.id) as status`, userId, userId).
				OrderExpr("topic.pos ASC, topic.created ASC"), nil
		}).
		Relation("Topics.Course").
		Relation("Topics.Lessons", func(query *orm.Query) (*orm.Query, error) {
			return query.Column("lesson.id", "lesson.name", "lesson.topic_id", "lesson.alias").OrderExpr("lesson.pos ASC, lesson.created ASC"), nil
		})
	if userId != "" {
		q.Relation("Topics.Lessons.Progress")
	}
	err := q.Select()

	return course, err
}

func (s *CourseStorage) List() (*[]dataType.Course, error) {
	var courses []dataType.Course

	err := s.db.Model(&courses).OrderExpr("id DESC").Select()

	return &courses, err
}
