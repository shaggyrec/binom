package controllers

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/mailer"
	"binom/server/responses"
	"binom/server/service"
	"binom/server/storage"
	"github.com/go-chi/render"
	"github.com/google/uuid"
	"log"
	"net/http"
	"os"
)

type AuthController struct {
	authCodeService *service.AuthCodeService
	authService     *service.AuthService
	tokenService    *service.TokenService
	userStorage 	*storage.UserStorage
	mailer          *mailer.Mailer
}

func (c *AuthController) Init(authCodeService *service.AuthCodeService, authService *service.AuthService,
	tokenService *service.TokenService, userStorage *storage.UserStorage, mailer *mailer.Mailer) {

	c.authCodeService = authCodeService
	c.authService = authService
	c.tokenService = tokenService
	c.userStorage = userStorage
	c.mailer = mailer
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

	err := c.mailer.Mail(
		[]string{ b.Email },
		"Код подтверждения",
		struct {
			Code string
			Id string
		}{authCode.Code, authCode.Id},
		mailer.TypeVerificationCode,
		nil,
	)

	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	render.JSON(w, r, struct{ Id string `json:"id"` } { Id: authCode.Id })
}

func (c *AuthController) CheckCodeAndAuth(w http.ResponseWriter, r *http.Request) {
	c.authByCode(w, r)
}

func (c *AuthController) Subscribe(w http.ResponseWriter, r *http.Request) {
	user := c.authByCode(w, r)

	if user == nil {
		return
	}
	dir, _ := os.Getwd()
	c.mailer.Mail(
		[]string{user.Email.String},
		"Подтверждение регистрации",
		nil,
		mailer.TypeSubscription,
		[]string{dir + "/server/views/attachments/ege-22-sh.pdf"},
	)
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
		exceptions.UnauthorizedError(w, r, err.Error(), exceptions.ErrorBadToken)
		return
	}

	user, err := c.userStorage.Get(userId)

	if err != nil {
		exceptions.ServerError(w, r)
		return
	}

	tokens, err := c.tokenService.GenerateTokenPair(user)

	if err != nil {
		exceptions.ServerError(w, r)
		return
	}

	render.JSON(w, r, tokens)
}

func (c *AuthController) authByCode(w http.ResponseWriter, r *http.Request) *dataType.User {
	var b struct { Code string `json:"code"`; Id string `json:"id"` }
	if err := functions.ParseRequest(w, r, &b);  err != nil {
		return nil
	}

	if b.Code == "" || b.Id == "" {
		exceptions.BadRequestError(w, r, "`code` and `id` are mandatory", exceptions.ErrorFieldIsMandatory)
		return nil
	}
	if _, err := uuid.Parse(b.Id); err != nil {
		exceptions.BadRequestError(w, r, "Invalid code id", exceptions.ErrorFieldIsMandatory)
		return nil
	}

	recipient, err := c.authCodeService.Check(b.Id, b.Code)
	if err != nil {
		exceptions.BadRequestError(w, r, err.Error(), exceptions.ErrorInvalidAuthCode)
		return nil
	}

	user, tokens, err := c.authService.AuthByEmail(recipient)

	if err != nil {
		exceptions.ServerError(w, r)
		return nil
	}

	render.JSON(w, r, responses.CheckCodeAndAuthResponse{User: user, Tokens: tokens})
	return user

}