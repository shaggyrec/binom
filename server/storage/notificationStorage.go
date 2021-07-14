package storage

import (
	"binom/server/dataType"
	"errors"
	"github.com/go-pg/pg"
)

type NotificationStorage struct {
	db *pg.DB
}

func (s *NotificationStorage) Init(db *pg.DB) {
	s.db = db
}

func (s *NotificationStorage) Create(notification *dataType.Notification) (*dataType.Notification, error) {
	_, err := s.db.Model(notification).Insert()

	return notification, err
}

func (s *NotificationStorage) Update(notification *dataType.UserNotification) (*dataType.UserNotification, error) {
	r, err := s.db.Model(notification).WherePK().Update()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}

	return notification, err
}

func (s *NotificationStorage) CreateUserNotification(notificationId string, userId string) (*dataType.UserNotification, error) {
	n := &dataType.UserNotification{NotificationId: notificationId, UserId: userId}
	_, err := s.db.Model(n).Insert()

	return n, err
}

func (s *NotificationStorage) UpdateUserNotification(n *dataType.UserNotification) (*dataType.UserNotification, error) {
	r, err := s.db.Model(n).WherePK().Update()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}

	return n, err
}

func (s *NotificationStorage) ListByUserId(userId string) (*[]dataType.UserNotification, error) {
	var list []dataType.UserNotification
	err := s.db.Model(&list).
		Relation("Notification").
		Where("user_id = ?", userId).
		Select()

	return &list, err
}

func (s *NotificationStorage) UserNotification(id string, userId string) (*dataType.UserNotification, error) {
	var n *dataType.UserNotification
	err := s.db.Model(n).Where("user_id = ? AND id = ?", userId, id).Select()

	return n, err
}