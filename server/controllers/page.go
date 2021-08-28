package controllers

import (
	"html/template"
	"net/http"
	"os"
)

type PageController struct {
	viewsPath string
}

func (c *PageController) Init() {
	pwd, _ := os.Getwd()

	c.viewsPath = pwd + "/server/views"
}

func (c *PageController) Main (w http.ResponseWriter, r *http.Request)  {
	tmpl := template.Must(template.ParseFiles(c.viewsPath + "/index.html"))
	tmpl.Execute(w, nil)
}
