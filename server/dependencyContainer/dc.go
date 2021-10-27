package dependencyContainer

import (
	"binom/server/mailer"
	"binom/server/service"
	"binom/server/storage"
	"binom/server/telegramBot"
	"github.com/go-pg/pg"
)

type DC struct {
	Db *pg.DB
	Storages struct{
		AuthCode *storage.AuthCodeStorage
		Token *storage.TokenStorage
		User *storage.UserStorage
		Topic *storage.TopicStorage
		Lesson *storage.LessonStorage
		File *storage.FileStorage
		LessonComment *storage.LessonCommentStorage
		Notification *storage.NotificationStorage
		Tariff *storage.TariffStorage
		TariffPrice *storage.TariffPriceStorage
		UserSubscription *storage.UserSubscriptionStorage
		Transaction *storage.TransactionStorage
		PointsMovement *storage.PointsMovementStorage
		PostStorage *storage.PostStorage
		PostCommentStorage *storage.PostCommentStorage
		UtmStorage *storage.UtmStorage
		SentEmail *storage.SentEmailStorage
	}
	Services struct{
		Token *service.TokenService
		AuthCode *service.AuthCodeService
		Auth *service.AuthService
		MoveAtPosition *service.MoveAtPositionService
		Notification *service.NotificationService
		LessonProgress *service.LearningProgressService
		YooMoney *service.YoomoneyService
		UserScore *service.UserScoreService
	}

	Mailer *mailer.Mailer
}

func New(db *pg.DB, host, jwtSecret string, technicalTelegramBot *telegramBot.BotForChat) *DC {
	dc := DC{}
	dc.init(db, host, jwtSecret, technicalTelegramBot)
	return &dc
}

func (dc *DC) init(db *pg.DB, host, jwtSecret string, technicalTelegramBot *telegramBot.BotForChat) {
	dc.Db = db
	dc.initStorages()
	dc.initDependencies()
	dc.initServices(host, jwtSecret, technicalTelegramBot)
}

func (dc *DC) initStorages() {
	storageFactory := &storage.Factory{}
	dc.Storages.AuthCode = storageFactory.AuthCode(dc.Db)
	dc.Storages.Token = storageFactory.Token(dc.Db)
	dc.Storages.User = storageFactory.User(dc.Db)
	dc.Storages.Topic = storageFactory.Topic(dc.Db)
	dc.Storages.Lesson = storageFactory.Lesson(dc.Db)
	dc.Storages.File = storageFactory.File(dc.Db)
	dc.Storages.LessonComment = storageFactory.LessonComment(dc.Db)
	dc.Storages.Notification = storageFactory.Notification(dc.Db)
	dc.Storages.Tariff = storageFactory.Tariff(dc.Db)
	dc.Storages.TariffPrice = storageFactory.TariffPrice(dc.Db)
	dc.Storages.UserSubscription = storageFactory.UserSubscription(dc.Db)
	dc.Storages.Transaction = storageFactory.Transaction(dc.Db)
	dc.Storages.PointsMovement = storageFactory.PointsMovement(dc.Db)
	dc.Storages.PostStorage = storageFactory.Post(dc.Db)
	dc.Storages.PostCommentStorage = storageFactory.PostComment(dc.Db)
	dc.Storages.UtmStorage = storageFactory.Utm(dc.Db)
	dc.Storages.SentEmail = storageFactory.SentEmail(dc.Db)
}

func (dc *DC) initServices(host, jwtSecret string, technicalTelegramBot *telegramBot.BotForChat) {
	serviceFactory := service.Factory{}
	dc.Services.Token = serviceFactory.TokenService(jwtSecret, dc.Storages.Token)
	dc.Services.AuthCode = serviceFactory.AuthCodeService(dc.Storages.AuthCode)
	dc.Services.Auth = serviceFactory.AuthService(dc.Storages.User, dc.Services.Token, technicalTelegramBot)
	dc.Services.MoveAtPosition = serviceFactory.MoveAtPosition(dc.Db)
	dc.Services.Notification = serviceFactory.Notification(dc.Storages.Notification, dc.Storages.User, technicalTelegramBot, dc.Mailer)
	dc.Services.LessonProgress = serviceFactory.LessonProgress(dc.Db)
	dc.Services.YooMoney = serviceFactory.Yoomoney(host)
	dc.Services.UserScore = serviceFactory.UserScore(dc.Storages.Lesson, dc.Storages.User, dc.Storages.PointsMovement, dc.Db)
}

func (dc *DC) initDependencies() {
	dc.Mailer = &mailer.Mailer{}
	dc.Mailer.Init(dc.Storages.SentEmail)
}

