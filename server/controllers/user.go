package controllers

import (
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/requests"
	"binom/server/storage"
	"database/sql"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
	"log"
	"net/http"
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
	user, err := u.storage.GetByUsername(username)

	if err != nil {
		exceptions.NotFoundError(w, r, "User not found")
		return
	}

	functions.RenderJSON(w, r, user)
}

func (u *UserController) Update(w http.ResponseWriter, r * http.Request)  {
	var dataToUpdate requests.UserUpdate
	userId := chi.URLParam(r, "userId")

	if err := functions.ParseRequest(w, r, &dataToUpdate); err != nil {
		exceptions.BadRequestError(w, r, err.Error(), exceptions.ErrorBadParam)
	}

	user, err := u.storage.Get(userId)

	if err != nil {
		exceptions.NotFoundError(w, r, "User #" +userId + "not found")
		return
	}

	if dataToUpdate.Username != "" {
		user.Username = null.String{sql.NullString{dataToUpdate.Username, true}}
	}
	if dataToUpdate.Name != "" {
		user.Name = null.String{sql.NullString{dataToUpdate.Name, true}}
	}

	fmt.Println(user)

	if _, err := u.storage.Update(user); err != nil {
		log.Print(err)
		pgErr, ok := err.(pg.Error)
		if ok && pgErr.IntegrityViolation() {
			exceptions.BadRequestError(w, r, "Username \"" + user.Username.String + "\" is taken", exceptions.AlreadyExists)
		} else {
			exceptions.BadRequestError(w, r, err.Error(), exceptions.NothingAffected)
		}
		return
	}

	render.JSON(w, r, "ok")
}


