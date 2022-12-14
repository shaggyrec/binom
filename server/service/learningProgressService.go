package service

import (
	"binom/server/functions"
	"github.com/go-pg/pg"
	"time"
)

type LearningProgressService struct {
	db *pg.DB
}

type ProgressLevel struct {
	TopicId string
	TopicName string
	Lessons []string
	LessonsNames []string
	PassedLessons []string
	LessonId string
	LessonAlias string
	Finished pg.NullTime
	LessonsAliases []string
	PassedLessonsAliases []string
	LessonScore map[string]struct{PassedTasks int; MaxTasks int}
	Updated pg.NullTime
}

type UserProgress struct {
	TopicId string
	TopicName string
	LessonId string
	Finished pg.NullTime
	Created pg.NullTime
}

func (s *LearningProgressService) Init(db *pg.DB) {
	s.db = db
}

func (s *LearningProgressService) ProgressLevelByLessonAlias(lessonAlias string, userId string) (*ProgressLevel, error) {
	var pl ProgressLevel
	_, err := s.db.Query(
		&pl,
		`SELECT
	tl.topic_id,
	t.name as topic_name,
	jsonb_agg(tl.id order by tl.pos ASC, tl.created ASC) lessons,
	jsonb_agg(tl.alias order by tl.pos ASC, tl.created ASC) lessons_aliases,
	jsonb_agg(tl.name order by tl.pos ASC, tl.created ASC) lessons_names,
	ut.lesson_id,
	ut.finished,
	ut.updated
FROM lessons l
LEFT JOIN lessons tl ON tl.topic_id = l.topic_id
LEFT JOIN user_topics ut ON ut.topic_id = l.topic_id AND ut.user_id = ?
LEFT JOIN topics t ON l.topic_id = t.id
WHERE l.alias = ?
GROUP BY tl.topic_id, t.name, ut.lesson_id, ut.finished, ut.updated
`,
	userId, lessonAlias,
)

	indexOFCurrentLesson := functions.IndexOf(pl.Lessons, pl.LessonId)
	if indexOFCurrentLesson != -1 {
		pl.LessonAlias = pl.LessonsAliases[indexOFCurrentLesson]
	}

	if pl.Finished.String() != "" && !pl.Finished.IsZero() {
		pl.PassedLessons = pl.Lessons
		pl.PassedLessonsAliases = pl.LessonsAliases
	} else if indexOFCurrentLesson > 0 {
		pl.PassedLessons = pl.Lessons[:indexOFCurrentLesson]
		pl.PassedLessonsAliases = pl.LessonsAliases[:indexOFCurrentLesson]
	} else {
		pl.PassedLessons = []string{}
		pl.PassedLessonsAliases = []string{}
	}

	return &pl, err
}

func (s *LearningProgressService) Save(lessonAlias string, userId string) (*ProgressLevel, error) {
	currentProgress, err := s.ProgressLevelByLessonAlias(lessonAlias, userId)
	if err != nil {
		return &ProgressLevel{}, err
	}
	err = s.save(currentProgress, lessonAlias, userId)

	currentProgress.LessonId = currentProgress.Lessons[functions.IndexOf(currentProgress.LessonsAliases, lessonAlias)]

	return currentProgress, err
}


func (s *LearningProgressService) IsLessonPassed(lessonAlias string, userId string) (bool, error) {
	currentProgress, err := s.ProgressLevelByLessonAlias(lessonAlias, userId)
	if err != nil {
		return false, err
	}

	return functions.IndexOf(currentProgress.PassedLessonsAliases, lessonAlias) != -1, nil
}

func (s *LearningProgressService) Pass(currentProgress *ProgressLevel, lessonAlias, userId string, passedTasks, maxTasks int) (*ProgressLevel, error) {
	indexOfTheNextLesson := functions.IndexOf(currentProgress.LessonsAliases, lessonAlias) + 1

	if currentProgress.LessonScore == nil {
		currentProgress.LessonScore = map[string]struct {
			PassedTasks int
			MaxTasks    int
		}{}
	}
	currentProgress.LessonScore[currentProgress.LessonId] = struct {
		PassedTasks int
		MaxTasks    int
	}{PassedTasks: passedTasks, MaxTasks: maxTasks}

	if indexOfTheNextLesson == len(currentProgress.Lessons) {
		currentProgress.Finished = pg.NullTime{Time: time.Now()}
	} else {
		lessonAlias = currentProgress.LessonsAliases[indexOfTheNextLesson]
		currentProgress.LessonId = currentProgress.Lessons[indexOfTheNextLesson]
	}

	err := s.save(currentProgress, lessonAlias, userId)
	return currentProgress, err
}

func (s *LearningProgressService) AllProgress(userId string) (*[]UserProgress, error) {
	var pl []UserProgress
	_, err := s.db.Query(
		&pl,
		`SELECT p.topic_id, t.name as topic_name, p.lesson_id, p.created, p.finished
			FROM user_topics p
			 LEFT JOIN topics t ON t.id = p.topic_id
			WHERE p.user_id = ?`,
		userId,
	)

	return &pl, err
}

func (s *LearningProgressService) save(currentProgress *ProgressLevel, lessonAlias string, userId string) error {
	var err error
	if currentProgress.LessonId == "" {
		_, err = s.db.Exec(
			"INSERT INTO user_topics (topic_id, user_id, lesson_id, lessons_score) VALUES (?,?, (SELECT id FROM lessons WHERE alias = ?), ?)",
			currentProgress.TopicId,
			userId,
			lessonAlias,
			currentProgress.LessonScore,
		)
	}  else {
		_, err = s.db.Exec(
			"UPDATE user_topics SET lesson_id = (SELECT id FROM lessons WHERE alias = ?), finished = ?, lessons_score = ?, updated = NOW() WHERE user_id = ? AND topic_id = ?",
			lessonAlias,
			currentProgress.Finished,
			currentProgress.LessonScore,
			userId,
			currentProgress.TopicId,
		)
	}
	return err
}