package controllers

import (
	"github.com/go-chi/render"
	"net/http"
)

type TopicController struct {
}

func (c *TopicController) Init() {
}

func (c *TopicController) Create(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, r, "ok")
}
