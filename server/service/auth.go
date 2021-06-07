package service

import (
	"binom/server/dataType"
	"binom/server/storage"
)

type AuthService struct {
	userStorage *storage.UserStorage
	tokenService *TokenService
}

func (a *AuthService) Init(userStorage *storage.UserStorage, tokenService *TokenService)  {
	a.userStorage = userStorage
	a.tokenService = tokenService
}

func (a *AuthService) AuthByEmail(email string) (*dataType.User, map[string]string, error) {
	user, err := a.userStorage.GetByEmail(email)

	if err != nil {
		user, err = a.userStorage.Create(&dataType.User{Email: dataType.NullString{String: email, Valid: true}})
		if err != nil {
			return user, nil, err
		}
	}

	tokens, err := a.tokenService.GenerateTokenPair(user.Id)

	return user, tokens, err
}