package controllers

import (
	"binom/server/dataType"
	"binom/server/functions"
	"binom/server/mailer"
	"binom/server/storage"
	"encoding/json"
	"github.com/go-chi/render"
	"net/http"
	"strconv"
)

type AuthController struct {
	authCodeStorage *storage.AuthCodeStorage
}

func (c *AuthController) Init(authCodeStorage *storage.AuthCodeStorage) {
	c.authCodeStorage = authCodeStorage
}

func (c *AuthController) Email(w http.ResponseWriter, r *http.Request) {
	var b struct { Email string `json:"email"` }
	if err := json.NewDecoder(r.Body).Decode(&b); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if b.Email == "" {
		http.Error(w, "Email is mandatory", http.StatusBadRequest)
		return
	}

	lastAuthCode := c.authCodeStorage.GetLastCodeOfRecipient(b.Email)
	if lastAuthCode != nil {
		c.authCodeStorage.Invalidate(lastAuthCode)
	}
	code := strconv.Itoa(functions.RandomInt(100000, 999999))

	authCode := c.authCodeStorage.Create(&dataType.AuthCode{Code: code, Recipient: b.Email})

	err := mailer.Mail(
		[]string{ b.Email },
		"Verification code",
		code,
		mailer.TypeVerificationCode,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	render.JSON(w, r, struct{ Id string `json:"id"` } { Id: authCode.Id })
}
