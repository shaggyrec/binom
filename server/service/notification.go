package service

import "binom/server/storage"

type NotificationService struct {
	notificationStorage *storage.NotificationStorage
}

func (s *NotificationService) Init(notificationStorage *storage.NotificationStorage)  {
	s.notificationStorage = notificationStorage
}

func (s *NotificationService) Create() {

}

func (s *NotificationService) Viewed()  {

}
