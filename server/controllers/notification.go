package controllers

import (
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/service"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"log"
	"net/http"
	"strconv"
)

type NotificationController struct {
	notificationService *service.NotificationService
}

func (c *NotificationController) Init(notificationService *service.NotificationService)  {
	c.notificationService = notificationService
}

func (c *NotificationController) List(w http.ResponseWriter, r *http.Request) {
	limit := 50
	offset := 0
	limitFromRequest := r.URL.Query().Get("limit")
	offsetFromRequest := r.URL.Query().Get("offset")

	if limitFromRequest != "" {
		limit, _ = strconv.Atoi(limitFromRequest)
	}

	if offsetFromRequest != "" {
		offset, _ = strconv.Atoi(offsetFromRequest)
	}

	l, err := c.notificationService.ListForUser(r.Context().Value("userId").(string), limit, offset)

	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	functions.RenderJSON(w, r, *l)
}

func (c *NotificationController) Viewed(w http.ResponseWriter, r *http.Request)  {
	userId := r.Context().Value("userId").(string)
	notificationId := chi.URLParam(r, "id")

	_, err := c.notificationService.Viewed(notificationId, userId)

	if err != nil {
		exceptions.NotFoundError(w, r, "Notification not found")
		return
	}

	render.JSON(w, r, "ok")
}
