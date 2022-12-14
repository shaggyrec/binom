package dataType

import (
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
)

const NotificationInfo = 1
const NotificationLessonComment = 2
const NotificationFeedComment = 3
const NotificationLessonProgressChanged = 4
const NotificationSubscriptionActivate =  5
const NotificationTopicIsOpened = 6
const NotificationLessonDeadline = 7
const NotificationSubscriptionIsExpired = 8
const NotificationSubscriptionIsExpiring = 9

var NotificationTypeDescMap = map[int64]string{
	NotificationInfo: "Оповещение",
	NotificationLessonComment: "Комментарий к уроку",
	NotificationFeedComment: "Комментарий к посту",
	NotificationLessonProgressChanged: "Получен зачёт",
	NotificationSubscriptionActivate: "Подписка активирована",
	NotificationTopicIsOpened: "Доступна новая тема",
	NotificationLessonDeadline: "Необходимо завершить урок",
	NotificationSubscriptionIsExpiring: "Подписка на binom.school заканчивается",
	NotificationSubscriptionIsExpired: "Подписка на binom.school закончилась",
}

type NotificationMeta struct {
	Lesson string `json:"lesson"`
	Post string `json:"post"`
	Comment string `json:"comment"`
	Link string `json:"link"`
}

type Notification struct {
	Id string `json:"id"`
	Message string `json:"message"`
	Type null.Int `json:"type"`
	Created  pg.NullTime      `json:"created"`
	Meta     NotificationMeta `json:"meta"`
	AuthorId string           `json:"-"`
	Author *User `pg:"rel:has-one" json:"author"`
}
