package service

import "binom/server/storage"

type Factory struct {
	authCodeService *AuthCodeService
}

func (f *Factory) AuthCodeService(authCodeStorage *storage.AuthCodeStorage) *AuthCodeService {
	if f.authCodeService == nil {
		authCodeService := AuthCodeService{}
		authCodeService.Init(authCodeStorage)
		f.authCodeService = &authCodeService
	}
	return f.authCodeService
}
