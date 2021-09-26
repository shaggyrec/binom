package scheduler

import (
	"binom/server/dataType"
	"binom/server/service"
	"fmt"
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
	"log"
)

// TODO probably we need to relocate this to the DB someday

type tasks struct {
	db *pg.DB
	notificationService *service.NotificationService
}

func (t *tasks) Init(db *pg.DB, notificationService *service.NotificationService) *tasks {
	t.db = db
	t.notificationService = notificationService

	return t
}

func (t *tasks) topicIsOpened() {
	var topics []struct{Id string; Name string; Alias string}

	r, err := t.db.Query(
		&topics,
		"SELECT id, name, alias FROM topics WHERE open_date = to_char(NOW(), 'DD-MM')",
	)

	if err != nil {
		log.Println(err)
		return
	}

	if r.RowsReturned() == 0 {
		return
	}

	var subscribersIds []string

	r, err = t.db.Query(
		&subscribersIds,
		`SELECT u.id
					FROM user_subscriptions us
					LEFT JOIN users u ON us.user_id = u.id
				WHERE status = 1 AND expired < NOW()
				GROUP by u.id, u.name, u.email`,
	)

	if err != nil {
		log.Println(err)
		return
	}

	if r.RowsReturned() == 0 {
		return
	}

	for _, topic := range topics {
		err = t.notificationService.Create(&dataType.Notification{
			Message:  fmt.Sprintf("Тема «%s» открыта. Скорее переходи к обучению!", topic.Name),
			Type:     null.IntFrom(dataType.NotificationTopicIsOpened),
		}, subscribersIds)
		if err != nil {
			log.Println(err)
		}
	}
}