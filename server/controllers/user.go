package controllers

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/storage"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
	"log"
	"net/http"
	"strings"
)

type UserController struct {
	storage *storage.UserStorage
}

func (u *UserController) Init(storage *storage.UserStorage) {
	u.storage = storage
}

func (u *UserController) Me(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value("userId").(string)
	user, _ := u.storage.Get(userId)

	functions.RenderJSON(w, r, user)
}

func (u *UserController) ByUsername(w http.ResponseWriter, r *http.Request)  {
	username := chi.URLParam(r, "username")
	userRole :=r.Context().Value("userRole")
	userId := r.Context().Value("userId").(string)

	user, err := u.storage.GetByUsername(username)

	if err != nil {
		exceptions.NotFoundError(w, r, "User not found")
		return
	}

	if userId != user.Id && userRole != dataType.UserRoleAdmin {
		user.Email = null.String{}
		user.Subscription = nil
		user.Points = 0
	}

	functions.RenderJSON(w, r, user)
}

func (u *UserController) Update(w http.ResponseWriter, r * http.Request)  {
	var dataToUpdate  map[string]interface{}
	userId := chi.URLParam(r, "userId")
	currentUserId := r.Context().Value("userId").(string)
	userRole := r.Context().Value("userRole").(int)

	if currentUserId != userId && userRole != dataType.UserRoleAdmin {
		exceptions.Forbidden(w, r, "Нет доступа")
		return
	}

	if err := functions.ParseRequest(w, r, &dataToUpdate); err != nil {
		exceptions.BadRequestError(w, r, err.Error(), exceptions.ErrorBadParam)
		return
	}

	if err := u.storage.Update(userId, dataToUpdate); err != nil {
		log.Print(err)
		pgErr, ok := err.(pg.Error)
		if ok && pgErr.IntegrityViolation() && strings.Index(err.Error(), "username") > -1 {
			exceptions.BadRequestError(w, r, "Username \"" + dataToUpdate["username"].(string) + "\" занят другим пользователем. Придумай другой.", exceptions.AlreadyExists)
		} else {
			exceptions.BadRequestError(w, r, err.Error(), exceptions.NothingAffected)
		}
		return
	}

	render.JSON(w, r, "ok")
}


