package service

import (
	"binom/server/functions"
	"github.com/go-pg/pg"
	"time"
)

type LearningProgressService struct {
	db *pg.DB
}

type progressLevel struct {
	TopicId string
	Lessons []string
	PassedLessons []string
	LessonId string
	Finished pg.NullTime
	LessonsAliases []string
	PassedLessonsAliases []string
}

func (s *LearningProgressService) Init(db *pg.DB) {
	s.db = db
}

func (s *LearningProgressService) ProgressLevelByLessonAlias(lessonAlias string, userId string) (*progressLevel, error) {
	var pl progressLevel
	_, err := s.db.Query(
		&pl,
		`SELECT
	tl.topic_id,
	jsonb_agg(tl.id order by tl.pos ASC, tl.created ASC) lessons,
	jsonb_agg(tl.alias order by tl.pos ASC, tl.created ASC) lessons_aliases,
	ut.lesson_id,
	ut.finished
FROM lessons l
LEFT JOIN lessons tl ON tl.topic_id = l.topic_id
LEFT JOIN user_topics ut ON ut.topic_id = l.topic_id AND ut.user_id = ?
WHERE l.alias = ?
GROUP BY tl.topic_id, ut.lesson_id, ut.finished
`,
	userId, lessonAlias,
)

	indexOFCurrentLesson := functions.IndexOf(pl.Lessons, pl.LessonId)

	if indexOFCurrentLesson > -1 {
		pl.PassedLessons = pl.Lessons[:indexOFCurrentLesson+1]
		pl.PassedLessonsAliases = pl.LessonsAliases[:indexOFCurrentLesson+1]
	} else {
		pl.PassedLessons = []string{}
		pl.PassedLessonsAliases = []string{}
	}

	return &pl, err
}

func (s *LearningProgressService) Save(lessonAlias string, userId string) error {
	currentProgress, err := s.ProgressLevelByLessonAlias(lessonAlias, userId)
	if err != nil {
		return err
	}
	return s.save(currentProgress, lessonAlias, userId)
}


func (s *LearningProgressService) IsLessonPassed(lessonAlias string, userId string) (bool, error) {
	currentProgress, err := s.ProgressLevelByLessonAlias(lessonAlias, userId)
	if err != nil {
		return false, err
	}

	return functions.IndexOf(currentProgress.PassedLessonsAliases, lessonAlias) != -1, nil
}

func (s *LearningProgressService) Pass(lessonAlias string, userId string) error {
	currentProgress, err := s.ProgressLevelByLessonAlias(lessonAlias, userId)

	if err != nil {
		return err
	}

	indexOfTheNextLesson := functions.IndexOf(currentProgress.LessonsAliases, lessonAlias) + 1

	if indexOfTheNextLesson == len(currentProgress.Lessons) {
		currentProgress.Finished = pg.NullTime{Time: time.Now()}
		// TODO notify about passed topic
	} else {
		lessonAlias = currentProgress.LessonsAliases[indexOfTheNextLesson]
		// TODO notify about passed lesson
	}

	return s.save(currentProgress, lessonAlias, userId)
}
func (s *LearningProgressService) save(currentProgress *progressLevel, lessonAlias string, userId string) error {
	var err error
	if currentProgress.LessonId == "" {
		_, err = s.db.Exec(
			"INSERT INTO user_topics (topic_id, user_id, lesson_id) VALUES (?,?, (SELECT id FROM lessons WHERE alias = ?))",
			currentProgress.TopicId,
			userId,
			lessonAlias,
		)
	}  else {
		_, err = s.db.Exec(
			"UPDATE user_topics SET lesson_id = (SELECT id FROM lessons WHERE alias = ?), finished = ? WHERE user_id = ? AND topic_id = ?",
			lessonAlias,
			currentProgress.Finished,
			userId,
			currentProgress.TopicId,
		)
	}
	return err
}