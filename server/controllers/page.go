package controllers

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/storage"
	"fmt"
	"html/template"
	"net/http"
	"os"
)

type PageController struct {
	viewsPath            string
	topicStorage         *storage.TopicStorage
	lessonStorage        *storage.LessonStorage
	host                 string
	version              string
	tariffStorage        *storage.TariffStorage
	questionnaireStorage *storage.QuestionnaireStorage
}

func (c *PageController) Init(topicStorage *storage.TopicStorage, lessonStorage *storage.LessonStorage, tariffStorage *storage.TariffStorage, host, version string, questionnaireStorage *storage.QuestionnaireStorage) {
	pwd, _ := os.Getwd()

	c.viewsPath = pwd + "/server/views"
	c.topicStorage = topicStorage
	c.lessonStorage = lessonStorage
	c.host = host
	c.version = version
	c.tariffStorage = tariffStorage
	c.questionnaireStorage = questionnaireStorage
}

func (c *PageController) Main(w http.ResponseWriter, r *http.Request) {
	tariffs, _ := c.tariffStorage.List([]int{dataType.StatusLive})
	c.renderTemplate(
		"index",
		w,
		r,
		map[string]interface{}{
			"TopicsCount":  c.topicStorage.Count(),
			"LessonsCount": c.topicStorage.Count(),
			"Tariffs":      tariffs,
		},
	)
}

func (c *PageController) App(w http.ResponseWriter, r *http.Request) {
	c.renderTemplate("react", w, r, nil)
}

func (c *PageController) MiniLanding(w http.ResponseWriter, r *http.Request) {
	c.renderTemplate("mini-landing", w, r, nil)
}

func (c *PageController) Privacy(w http.ResponseWriter, r *http.Request) {
	c.renderTemplate("privacy", w, r, nil)
}

func (c *PageController) Subscribe(w http.ResponseWriter, r *http.Request) {
	questionnaire, _ := c.questionnaireStorage.ById("00000000-0000-0000-0000-000000000000")

	c.renderTemplate("subscribe", w, r, map[string]interface{}{"Questions": questionnaire.Questions})
}

func (c *PageController) renderTemplate(name string, w http.ResponseWriter, r *http.Request, data map[string]interface{}) {
	if data != nil {
		data["Host"] = c.host
		data["Version"] = c.version
	} else {
		data = map[string]interface{}{"Host": c.host, "Version": c.version}
	}
	err := template.Must(template.ParseFiles(
		c.viewsPath+"/"+name+".html",
		c.viewsPath+"/parts/footer.html",
		c.viewsPath+"/parts/counters.html",
	)).Execute(w, data)
	if err != nil {
		fmt.Println(err)
		exceptions.ServerError(w, r)
	}
}
