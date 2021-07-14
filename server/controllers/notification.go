package controllers

import (
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/service"
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
