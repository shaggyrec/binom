package service

import "binom/server/storage"

type Factory struct {}

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

func (f *Factory) AuthService(userStorage *storage.UserStorage, tokenService *TokenService) *AuthService {
	service := AuthService{}
	service.Init(userStorage, tokenService)
	return &service
}
