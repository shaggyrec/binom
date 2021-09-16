package controllers

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/requests"
	"binom/server/responses"
	"binom/server/service"
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
	userScoreService *service.UserScoreService
}

func (c *LearningProgressController) Init(lessonProgressService *service.LearningProgressService, notificationService *service.NotificationService, userScoreService *service.UserScoreService) {
	c.lessonProgressService = lessonProgressService
	c.notificationService = notificationService
	c.userScoreService = userScoreService
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

	if err := functions.ParseRequest(w, r, &request); err != nil {
		return
	}

	var notificationText string
	p, err := c.lessonProgressService.ProgressLevelByLessonAlias(lessonAlias, userId)
	lessonId := p.LessonId
	lessonStartedDate := p.Updated.Time

	if request.Passed {
		if request.PassedTasks == 0 || request.MaxTasks == 0 {
			exceptions.BadRequestError(w, r, "Нужно указать сколько заданий выполнено", exceptions.ErrorBadParam)
			return
		}
		p, err = c.lessonProgressService.Pass(p, lessonAlias, userId, request.PassedTasks, request.MaxTasks)

		if err != nil {
			log.Print(err)
			exceptions.ServerError(w, r)
			return
		}
		addedPoints := c.userScoreService.AddScoreForTheLesson(lessonId, userId, float64(request.PassedTasks)/float64(request.MaxTasks), lessonStartedDate)
		if p != nil && (p.Finished.String() == "" || p.Finished.IsZero()) {
			notificationText = fmt.Sprintf("Зачёт за урок «%s». Mожно переходить к следующему. Начисленно %d баллов", p.LessonsNames[functions.IndexOf(p.LessonsAliases, lessonAlias)], addedPoints)
		} else {
			notificationText = fmt.Sprintf("Тема «%s» пройдена! Начисленно %d баллов", p.TopicName, addedPoints)
		}
	} else {
		exceptions.BadRequestError(w, r, "Обновить можно только Passed = true", exceptions.ErrorBadParam)
		return
	}

	n := &dataType.Notification{
		Type: null.IntFrom(dataType.NotificationLessonProgressChanged),
		Message: notificationText,
		Meta: dataType.NotificationMeta{ Lesson: p.LessonId },
		AuthorId: changerId,
	}
	if err := c.notificationService.Create(n, []string{userId}); err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	functions.RenderJSON(w, r, "Ok")
}