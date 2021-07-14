package service

import (
	"binom/server/dataType"
	"binom/server/storage"
	"database/sql"
	"gopkg.in/guregu/null.v4"
)

type NotificationService struct {
	notificationStorage *storage.NotificationStorage
	userStorage *storage.UserStorage
}

func (s *NotificationService) Init(notificationStorage *storage.NotificationStorage, userStorage *storage.UserStorage) {
	s.notificationStorage = notificationStorage
	s.userStorage = userStorage
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
	return nil
}

func (s *NotificationService) CreateForAdmins(notification *dataType.Notification) error {
	ids, err := s.userStorage.GetAdminsIds()
	if err != nil {
		return err
	}
	return s.Create(notification, ids)
}

func (s *NotificationService) Viewed(id string) (*dataType.UserNotification, error) {
	return s.notificationStorage.Update(&dataType.UserNotification{Id: id, Viewed: null.Bool{NullBool: sql.NullBool{Bool: true}}})
}

func (s *NotificationService) ListForUser(userId string) (*[]dataType.UserNotification, error) {
	return s.notificationStorage.ListByUserId(userId)
}