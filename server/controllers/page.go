package controllers

import (
	"github.com/go-chi/render"
	"net/http"
)

type PageController struct {
}

func (c *PageController) Main (w http.ResponseWriter, r *http.Request)  {
	render.HTML(w, r, "Hi from <b>binom</b>")
}
