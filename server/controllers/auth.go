package controllers

import (
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/mailer"
	"binom/server/service"
	"github.com/go-chi/render"
	"net/http"
)

type AuthController struct {
	authCodeService *service.AuthCodeService
}

func (c *AuthController) Init(authCodeService *service.AuthCodeService) {
	c.authCodeService = authCodeService
}

func (c *AuthController) Email(w http.ResponseWriter, r *http.Request) {
	var b struct { Email string `json:"email"` }
	if err := functions.ParseRequest(w, r, &b);  err != nil {
		return
	}

	if b.Email == "" {
		exceptions.BadRequestError(w, r, "Email is mandatory", exceptions.ErrorFieldIsMandatory)
		return
	}

	authCode := c.authCodeService.Generate(b.Email)

	err := mailer.Mail(
		[]string{ b.Email },
		"Verification code",
		authCode.Code,
		mailer.TypeVerificationCode,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	render.JSON(w, r, struct{ Id string `json:"id"` } { Id: authCode.Id })
}

func (c *AuthController) CheckCodeAndAuth(w http.ResponseWriter, r *http.Request) {
	var b struct { Code string `json:"code"`; Id string `json:"id"` }
	if err := functions.ParseRequest(w, r, &b);  err != nil {
		return
	}

	if b.Code == "" || b.Id == "" {
		exceptions.BadRequestError(w, r, "`code` and `id` is mandatory", exceptions.ErrorFieldIsMandatory)
		return
	}

	if err := c.authCodeService.Check(b.Id, b.Code); err != nil {
		exceptions.BadRequestError(w, r, err.Error(), exceptions.ErrorFieldIsMandatory)
		return
	}
}
