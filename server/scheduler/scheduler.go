package scheduler

import (
	"binom/server/scheduler/tasks"
	"binom/server/service"
	"binom/server/storage"
	"github.com/go-co-op/gocron"
	"github.com/go-pg/pg"
	"log"
	"time"
)

type Scheduler struct {
	db *pg.DB
	notificationService *service.NotificationService
	userSubscriptionStorage *storage.UserSubscriptionStorage
}

func New(db *pg.DB, notificationService *service.NotificationService, userSubscriptionStorage *storage.UserSubscriptionStorage) Scheduler {
	return Scheduler{db, notificationService, userSubscriptionStorage}
}

func (scheduler *Scheduler) Run() {
	s := gocron.NewScheduler(time.UTC)

	_, err := s.Every(1).Days().At("06:01").Do(tasks.TopicIsOpened(scheduler.db, scheduler.notificationService))
	_, err = s.Every(1).Days().At("06:11").Do(tasks.LessonDeadLine(scheduler.db, scheduler.notificationService))
	_, err = s.Every(1).Days().At("06:21").Do(tasks.UsersSubscriptions(scheduler.db, scheduler.notificationService, scheduler.userSubscriptionStorage))

	if err != nil {
		log.Println(err)
	}

	s.StartAsync()
}