package controllers

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/requests"
	"binom/server/responses"
	"binom/server/service"
	"database/sql"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"gopkg.in/guregu/null.v4"
	"log"
	"net/http"
)

type LearningProgressController struct {
	lessonProgressService *service.LearningProgressService
	notificationService *service.NotificationService
}

func (c *LearningProgressController) Init(lessonProgressService *service.LearningProgressService, notificationService *service.NotificationService) {
	c.lessonProgressService = lessonProgressService
	c.notificationService = notificationService
}

func (c *LearningProgressController) UsersProgressByLesson(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "userId")
	lessonAlias := chi.URLParam(r, "lessonAlias")

	isPassed, err := c.lessonProgressService.IsLessonPassed(lessonAlias, userId)

	if err != nil {
		exceptions.BadRequestError(w, r, err.Error(), 0)
		return
	}

	render.JSON(w, r, responses.UsersProgressByLessonResponse{Passed: isPassed})
}

func (c *LearningProgressController) UpdateUsersProgressByLesson(w http.ResponseWriter, r *http.Request) {
	changerId := r.Context().Value("userId").(string)
	userId := chi.URLParam(r, "userId")
	lessonAlias := chi.URLParam(r, "lessonAlias")

	var request requests.UpdateUsersProgressByLessonRequest

	err := functions.ParseRequest(w, r, &request)

	if err != nil {
		exceptions.BadRequestError(w, r, err.Error(), exceptions.ErrorBadParam)
		return
	}

	var notificationText string
	var p *service.ProgressLevel
	if request.Passed {
		p, err = c.lessonProgressService.Pass(lessonAlias, userId)
		if p != nil && p.Finished.String() == "" {
			notificationText = fmt.Sprintf("Зачёт за урок «%s» можно переходить к следующему", p.LessonsNames[functions.IndexOf(p.LessonsAliases, lessonAlias)])
		} else {
			notificationText = fmt.Sprintf("Тема «%s» пройдена!", p.TopicName)
		}
	} else {
		p, err = c.lessonProgressService.Save(lessonAlias, userId)
		notificationText = fmt.Sprintf("Преподаватель отменил зачёт и вернул на урок «%s»", p.LessonsNames[functions.IndexOf(p.LessonsAliases, lessonAlias)])
	}

	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	n := &dataType.Notification{
		Type: null.Int{NullInt64: sql.NullInt64{Int64: dataType.NotificationLessonProgressChanged}},
		Message: notificationText,
		Meta: dataType.Meta{ Lesson: p.LessonId },
		AuthorId: changerId,
	}
	err = c.notificationService.Create(n, []string{userId})

	functions.RenderJSON(w, r, "Ok")
}