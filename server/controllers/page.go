package controllers

import (
	"binom/server/storage"
	"html/template"
	"net/http"
	"os"
)

type PageController struct {
	viewsPath string
	topicStorage *storage.TopicStorage
	lessonStorage *storage.LessonStorage
}

func (c *PageController) Init(topicStorage *storage.TopicStorage, lessonStorage *storage.LessonStorage) {
	pwd, _ := os.Getwd()

	c.viewsPath = pwd + "/server/views"
	c.topicStorage = topicStorage
	c.lessonStorage = lessonStorage
}

func (c *PageController) Main (w http.ResponseWriter, r *http.Request)  {
	tmpl := template.Must(template.ParseFiles(c.viewsPath + "/index.html"))
	tmpl.Execute(
		w,
		map[string]interface{}{
			"TopicsCount": c.topicStorage.Count(),
			"LessonsCount": c.topicStorage.Count(),
		},
	)
}

func (c *PageController) App (w http.ResponseWriter, r *http.Request)  {
	tmpl := template.Must(template.ParseFiles(c.viewsPath + "/react.html"))
	tmpl.Execute(w, nil)
}

func (c *PageController) MiniLanding (w http.ResponseWriter, r *http.Request)  {
	tmpl := template.Must(template.ParseFiles(c.viewsPath + "/mini-landing.html"))
	tmpl.Execute(w, nil)
}
