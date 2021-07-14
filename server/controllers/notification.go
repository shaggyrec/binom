package controllers

import (
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/service"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"log"
	"net/http"
)

type NotificationController struct {
	notificationService *service.NotificationService
}

func (c *NotificationController) Init(notificationService *service.NotificationService)  {
	c.notificationService = notificationService
}

func (c *NotificationController) List(w http.ResponseWriter, r *http.Request) {
	l, err := c.notificationService.ListForUser(r.Context().Value("userId").(string))

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

	n, err := c.notificationService.GetUserNotification(userId, notificationId)

	if err != nil {
		exceptions.NotFoundError(w, r, err.Error())
		return
	}

	if n == nil {
		exceptions.NotFoundError(w, r, "Notification not found")
		return
	}

	_, err = c.notificationService.Viewed(notificationId)

	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	render.JSON(w, r, "ok")
}
