package service

import (
	"binom/server/dataType"
	"binom/server/storage"
	"binom/server/telegramBot"
	"gopkg.in/guregu/null.v4"
	"strings"
)

type AuthService struct {
	userStorage *storage.UserStorage
	tokenService *TokenService
	technicalTelegramBot *telegramBot.BotForChat
}

func (a *AuthService) Init(userStorage *storage.UserStorage, tokenService *TokenService, technicalTelegramBot *telegramBot.BotForChat)  {
	a.userStorage = userStorage
	a.tokenService = tokenService
	a.technicalTelegramBot = technicalTelegramBot
}

func (a *AuthService) AuthByEmail(email string) (*dataType.User, map[string]string, error) {
	user, err := a.userStorage.GetByEmail(email)

	if err != nil {
		user, err = a.userStorage.Create(&dataType.User{
			Email: null.StringFrom(email),
			Name: null.StringFrom(strings.Split(email, "@")[0]),
		})
		if err != nil {
			return user, nil, err
		}
		a.technicalTelegramBot.Message("Новый пользователь: " + email)
	}

	tokens, err := a.tokenService.GenerateTokenPair(user)

	return user, tokens, err
}