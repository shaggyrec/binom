package service

import (
	"binom/server/dataType"
	"binom/server/functions"
	"binom/server/storage"
	"errors"
	"strconv"
)

type AuthCodeService struct {
	storage *storage.AuthCodeStorage
}

func (s *AuthCodeService) Init (storage *storage.AuthCodeStorage)  {
	s.storage = storage
}

func (s *AuthCodeService) Check(id string, code string) error {
	authCode := s.storage.Get(id)
	if authCode.Code != code {
		return errors.New("code is invalid")
	}
	s.storage.Invalidate(authCode)
	return nil
}

func (s *AuthCodeService) Generate(recipient string) *dataType.AuthCode {
	lastAuthCode := s.storage.GetLastCodeOfRecipient(recipient)
	if lastAuthCode != nil {
		s.storage.Invalidate(lastAuthCode)
	}
	code := strconv.Itoa(functions.RandomInt(100000, 999999))

	return s.storage.Create(&dataType.AuthCode{Code: code, Recipient: recipient})
}
