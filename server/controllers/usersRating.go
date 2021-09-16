package controllers

import (
	"binom/server/exceptions"
	"binom/server/service"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"net/http"
	"strconv"
)

type UsersRatingController struct {
	userScoreService *service.UserScoreService
}

func (c *UsersRatingController) Init(userScoreService *service.UserScoreService)  {
	c.userScoreService = userScoreService
}

func (c *UsersRatingController) ByYear(w http.ResponseWriter, r * http.Request) {
	year, err := strconv.Atoi(chi.URLParam(r, "year"))

	if err != nil {
		exceptions.BadRequestError(w, r, "Bad year", exceptions.ErrorBadParam)
		return
	}

	render.JSON(w, r, c.userScoreService.UsersRatingByYear(year))
}
