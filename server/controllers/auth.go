package controllers

import (
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/mailer"
	"binom/server/responses"
	"binom/server/service"
	"github.com/go-chi/render"
	"net/http"
)

type AuthController struct {
	authCodeService *service.AuthCodeService
	authService     *service.AuthService
	tokenService    *service.TokenService
}

func (c *AuthController) Init(authCodeService *service.AuthCodeService, authService *service.AuthService, tokenService *service.TokenService) {
	c.authCodeService = authCodeService
	c.authService = authService
	c.tokenService = tokenService
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
		exceptions.BadRequestError(w, r, "`code` and `id` are mandatory", exceptions.ErrorFieldIsMandatory)
		return
	}
	recipient, err := c.authCodeService.Check(b.Id, b.Code)
	if err != nil {
		exceptions.BadRequestError(w, r, err.Error(), exceptions.ErrorInvalidAuthCode)
		return
	}

	user, tokens, err := c.authService.AuthByEmail(recipient)

	if err != nil {
		exceptions.ServerError(w, r)
		return
	}

	render.JSON(w, r, responses.CheckCodeAndAuthResponse{User: user, Tokens: tokens})
}

func (c *AuthController) RefreshToken (w http.ResponseWriter, r *http.Request) {
	var b struct { RefreshToken string `json:"refreshToken"` }
	if err := functions.ParseRequest(w, r, &b);  err != nil {
		return
	}

	accessToken, ok := r.Context().Value("token").(string)

	if !ok {
		exceptions.UnauthorizedError(w, r, "Access token is missed", exceptions.ErrorBadToken)
		return
	}

	if b.RefreshToken == "" {
		exceptions.BadRequestError(w, r, "`refreshToken` is mandatory", exceptions.ErrorFieldIsMandatory)
		return
	}

	userId, err := c.tokenService.CheckToken(b.RefreshToken, accessToken)

	if err != nil {
		exceptions.UnauthorizedError(w, r, "Something wrong with either refresh or access token", exceptions.ErrorBadToken)
		return
	}

	tokens, err := c.tokenService.GenerateTokenPair(userId)

	if err != nil {
		exceptions.ServerError(w, r)
		return
	}

	render.JSON(w, r, tokens)
}
