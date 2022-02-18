package service

import (
	"binom/server/mailer"
	"binom/server/storage"
	"binom/server/telegramBot"
	"github.com/go-pg/pg"
)

type Factory struct{}

func (f *Factory) AuthCodeService(authCodeStorage *storage.AuthCodeStorage) *AuthCodeService {
	authCodeService := AuthCodeService{}
	authCodeService.Init(authCodeStorage)
	return &authCodeService

}

func (f *Factory) TokenService(jwtSecret string, storage *storage.TokenStorage) *TokenService {
	tokenService := TokenService{}
	tokenService.Init(jwtSecret, storage)
	return &tokenService
}

func (f *Factory) AuthService(userStorage *storage.UserStorage, tokenService *TokenService, technicalTelegramBot *telegramBot.BotForChat) *AuthService {
	service := AuthService{}
	service.Init(userStorage, tokenService, technicalTelegramBot)
	return &service
}

func (f *Factory) MoveAtPosition(db *pg.DB) *MoveAtPositionService {
	service := MoveAtPositionService{}
	service.Init(db)
	return &service
}

func (f *Factory) Notification(notificationStorage *storage.NotificationStorage, userStorage *storage.UserStorage, technicalTelegramBot *telegramBot.BotForChat, mailer *mailer.Mailer) *NotificationService {
	s := NotificationService{}
	s.Init(notificationStorage, userStorage, technicalTelegramBot, mailer)
	return &s
}

func (f *Factory) LessonProgress(db *pg.DB) *LearningProgressService {
	s := LearningProgressService{}
	s.Init(db)
	return &s
}
func (f *Factory) Yoomoney(host string) *YoomoneyService {
	s := YoomoneyService{}
	s.Init(host)
	return &s
}

func (f *Factory) UserScore(lessonStorage *storage.LessonStorage, userStorage *storage.UserStorage, pointsMovementStorage *storage.PointsMovementStorage, db *pg.DB) *UserScoreService {
	s := UserScoreService{}
	s.Init(lessonStorage, userStorage, pointsMovementStorage, db)
	return &s
}

func (f *Factory) LearningProgress(db *pg.DB, progressStorage *storage.ProgressStorage) *ProgressService {
	s := ProgressService{}
	s.Init(db, progressStorage)
	return &s
}
