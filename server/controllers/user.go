package controllers

import (
	"binom/server/storage"
	"github.com/go-chi/render"
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

	render.JSON(w, r, user)
}


