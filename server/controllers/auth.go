package controllers

import (
	"binom/server/functions"
	"binom/server/mailer"
	"encoding/json"
	"github.com/go-chi/render"
	"github.com/go-pg/pg"
	"net/http"
	"strconv"
)

type AuthController struct {
	db *pg.DB
}

func (c *AuthController) Init(db *pg.DB) {
	c.db = db
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

	err := mailer.Mail(
		[]string{ b.Email },
		"Verification code",
		strconv.Itoa(functions.RandomInt(100000, 999999)),
		mailer.TypeVerificationCode,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	render.JSON(w, r, "Ok")
}
