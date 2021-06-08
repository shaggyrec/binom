package service

import (
	"binom/server/functions"
	"binom/server/storage"
	"errors"
	"github.com/dgrijalva/jwt-go"
	"time"
)

type TokenService struct {
	jwtSecret string
	storage *storage.TokenStorage
}

func (tokenService *TokenService) Init (jwtSecret string, storage *storage.TokenStorage)  {
	tokenService.jwtSecret = jwtSecret
	tokenService.storage = storage
}

func (tokenService *TokenService) GenerateTokenPair(userId string) (map[string]string, error) {
	// Create token
	token := jwt.New(jwt.SigningMethodHS256)


	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = time.Now().Add(time.Minute * 15).Unix()
	claims["id"] = userId


	t, err := token.SignedString([]byte(tokenService.jwtSecret))
	if err != nil {
		return nil, err
	}

	refreshToken := jwt.New(jwt.SigningMethodHS256)
	rtClaims := refreshToken.Claims.(jwt.MapClaims)
	rtClaims["exp"] = time.Now().Add(time.Hour * 24 * 31 * 12).Unix()

	rt, err := refreshToken.SignedString([]byte(tokenService.refreshTokenSign(t)))
	if err != nil {
		return nil, err
	}

	_, err = tokenService.storage.Create(rt, userId)

	if err != nil {
		return nil, err
	}

	return map[string]string{
		"accessToken":  t,
		"refreshToken": rt,
	}, nil
}

func (tokenService *TokenService) CheckToken(refreshToken string, accessToken string) (string, error) {
	var rtTokenClaims jwt.MapClaims
	var aTokenClaims jwt.MapClaims

	_, err := jwt.ParseWithClaims(refreshToken, &rtTokenClaims, func(token *jwt.Token) (interface{}, error) {
		return []byte(tokenService.refreshTokenSign(accessToken)), nil
	})

	if err != nil {
		return "", err
	}

	rt, err := tokenService.storage.Get(refreshToken)

	if err != nil {
		return "", errors.New("invalid refresh token")
	}

	err = tokenService.storage.Delete(rt.Id)

	_, err = jwt.ParseWithClaims(accessToken, &aTokenClaims, func(token *jwt.Token) (interface{}, error) {
		return []byte(tokenService.jwtSecret), nil
	})

	if err != nil {
		return "", err
	}

	return aTokenClaims["id"].(string), nil
}

func (tokenService *TokenService) refreshTokenSign(accessToken string) string {
	return functions.MD5(accessToken + tokenService.jwtSecret)
}