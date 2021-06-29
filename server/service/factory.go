package service

import (
	"binom/server/storage"
	"github.com/go-pg/pg"
)

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

func (f *Factory) MoveAtPosition(db *pg.DB) *MoveAtPositionService {
	service := MoveAtPositionService{}
	service.Init(db)
	return &service
}