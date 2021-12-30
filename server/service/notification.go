package service

import (
	"binom/server/dataType"
	"binom/server/mailer"
	"binom/server/storage"
	"binom/server/telegramBot"
	"database/sql"
	"errors"
	"gopkg.in/guregu/null.v4"
)

type NotificationService struct {
	notificationStorage *storage.NotificationStorage
	userStorage *storage.UserStorage
	technicalTelegramBot *telegramBot.BotForChat
	mailer *mailer.Mailer
}

func (s *NotificationService) Init(notificationStorage *storage.NotificationStorage, userStorage *storage.UserStorage, technicalTelegramBot *telegramBot.BotForChat, mailer *mailer.Mailer) {
	s.notificationStorage = notificationStorage
	s.userStorage = userStorage
	s.technicalTelegramBot = technicalTelegramBot
	s.mailer = mailer
}

func (s *NotificationService) Create(notification *dataType.Notification, userIds []string) error {
	n, err := s.notificationStorage.Create(notification)

	if err != nil {
		return err
	}
	for _, userId := range userIds {
		_, err = s.notificationStorage.CreateUserNotification(n.Id, userId)
		if err != nil {
			return err
		}
	}
	for _, user := range s.userStorage.GetUsersByIds(userIds) {
		err = s.mailer.Mail(
			[]string{user.Email.String},
			"Binom.school: " + dataType.NotificationTypeDescMap[notification.Type.Int64],
			struct {
				Message string
				User dataType.User
				Subject string
				Meta dataType.NotificationMeta
			}{
				Message: notification.Message,
				User: user,
				Subject: dataType.NotificationTypeDescMap[notification.Type.Int64],
				Meta: notification.Meta,
			},
			mailer.TypeNotification,
			nil,
		)
	}
	return err
}

func (s *NotificationService) CreateForAdmins(notification *dataType.Notification) error {
	ids, err := s.userStorage.GetAdminsIds()
	if err != nil {
		return err
	}
	s.technicalTelegramBot.Message(notification.Message)
	return s.Create(notification, ids)
}

func (s *NotificationService) Viewed(id string, userId string) (*dataType.UserNotification, error) {
	n, err:= s.notificationStorage.UserNotification(id, userId)
	if err != nil || n == nil {
		return nil, errors.New("notification not found")
	}
	n.Viewed = null.Bool{NullBool: sql.NullBool{Bool: true, Valid: true}}
	return s.notificationStorage.Update(n)
}

func (s *NotificationService) ListForUser(userId string, limit int, offset int) (*[]dataType.UserNotification, error) {
	return s.notificationStorage.ListByUserId(userId, limit, offset)
}

func (s *NotificationService) GetUserNotification(id string, userId string) (*dataType.UserNotification, error) {
	return s.notificationStorage.UserNotification(id, userId)
}