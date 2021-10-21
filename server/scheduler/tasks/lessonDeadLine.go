package tasks

import (
	"binom/server/dataType"
	"binom/server/service"
	"fmt"
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
	"log"
)

func LessonDeadLine(db *pg.DB, notificationService *service.NotificationService) func() {
	return func() {
		var deadlines []struct{UserId string; Alias string; Name string; DateDiff int}

		r, err := db.Query(
			&deadlines,
			`SELECT ut.user_id, l.alias, l.name, ut.updated::DATE - l.deadline + 1 - NOW()::DATE as date_diff
					FROM user_topics ut
						LEFT JOIN lessons l on l.id = ut.lesson_id
					WHERE ut.finished IS NULL AND ut.updated::DATE - l.deadline + 1 < NOW()::DATE`,
		)

		if err != nil {
			log.Println(err)
			return
		}

		if r.RowsReturned() == 0 {
			return
		}

		for _, deadline := range deadlines {
			m := "Дедлайн уже истёк"
			if deadline.DateDiff > 0 {
				m = "Остался всего один день"
			}
			err = notificationService.Create(&dataType.Notification{
				Message:  fmt.Sprintf(
					"Не забудь про урок «%s». %s. Если урок сдан после делайна, то ты получишь меньше баллов за домашнее задание",
					deadline.Name,
					m,
				),
				Type: null.IntFrom(dataType.NotificationLessonDeadline),
				Meta: dataType.NotificationMeta{Lesson: deadline.Alias},
			}, []string{deadline.UserId})
			if err != nil {
				log.Println(err)
			}
		}
	}
}


