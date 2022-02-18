package controllers

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/requests"
	"binom/server/responses"
	"binom/server/service"
	"binom/server/storage"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"gopkg.in/guregu/null.v4"
	"log"
	"net/http"
	"strconv"
)

type LearningProgressController struct {
	lessonProgressService *service.ProgressService
	notificationService   *service.NotificationService
	userScoreService      *service.UserScoreService
	lessonStorage         *storage.LessonStorage
	progressStorage       *storage.ProgressStorage
	topicStorage          *storage.TopicStorage
}

func (c *LearningProgressController) Init(lessonProgressService *service.ProgressService, notificationService *service.NotificationService, userScoreService *service.UserScoreService, lessonStorage *storage.LessonStorage, progressStorage *storage.ProgressStorage, topicStorage *storage.TopicStorage) {
	c.lessonProgressService = lessonProgressService
	c.notificationService = notificationService
	c.userScoreService = userScoreService
	c.lessonStorage = lessonStorage
	c.progressStorage = progressStorage
	c.topicStorage = topicStorage
}

func (c *LearningProgressController) UsersProgressByLesson(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "userId")
	lessonAlias := chi.URLParam(r, "lessonAlias")

	lesson, err := c.lessonStorage.GetByAlias(lessonAlias)

	if err != nil {
		exceptions.NotFoundError(w, r, "Lesson not found")
		return
	}
	p, err := c.progressStorage.ByLessonId(lesson.Id, userId)

	if err != nil {
		exceptions.BadRequestError(w, r, err.Error(), 0)
		return
	}

	render.JSON(w, r, responses.UsersProgressByLessonResponse{Passed: p.Score != ""})
}

func (c *LearningProgressController) UpdateUsersProgressByLesson(w http.ResponseWriter, r *http.Request) {
	changerId := r.Context().Value("userId").(string)
	userId := chi.URLParam(r, "userId")
	lessonAlias := chi.URLParam(r, "lessonAlias")

	lesson, err := c.lessonStorage.GetByAlias(lessonAlias)

	if err != nil {
		exceptions.NotFoundError(w, r, "Lesson not found")
		return
	}

	var request requests.UpdateUsersProgressByLessonRequest

	if err := functions.ParseRequest(w, r, &request); err != nil {
		return
	}

	var notificationText string
	lessonProgress, _ := c.progressStorage.ByLessonId(lesson.Id, userId)
	lessonStartedDate := lessonProgress.Created.Time

	if request.Passed {
		if request.PassedTasks == 0 || request.MaxTasks == 0 {
			exceptions.BadRequestError(w, r, "Нужно указать сколько заданий выполнено", exceptions.ErrorBadParam)
			return
		}
		_, err := c.progressStorage.SetScore(lesson.Id, userId, strconv.Itoa(request.PassedTasks)+"/"+strconv.Itoa(request.MaxTasks))

		if err != nil {
			log.Print(err)
			exceptions.ServerError(w, r)
			return
		}
		addedPoints := c.userScoreService.AddScoreForTheLesson(lesson.Id, userId, float64(request.PassedTasks)/float64(request.MaxTasks), lessonStartedDate)
		if !c.lessonProgressService.IsTopicFinished(lesson.TopicId, userId) {
			notificationText = fmt.Sprintf("Зачёт за урок «%s». Mожно переходить к следующему. Начисленно %d баллов", lesson.Name, addedPoints)
		} else {
			notificationText = fmt.Sprintf("Тема «%s» пройдена! Начисленно %d баллов", lesson.Topic.Name, addedPoints)
		}
	} else {
		exceptions.BadRequestError(w, r, "Обновить можно только Passed = true", exceptions.ErrorBadParam)
		return
	}

	n := &dataType.Notification{
		Type:     null.IntFrom(dataType.NotificationLessonProgressChanged),
		Message:  notificationText,
		Meta:     dataType.NotificationMeta{Lesson: lesson.Id},
		AuthorId: changerId,
	}
	if err := c.notificationService.Create(n, []string{userId}); err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	functions.RenderJSON(w, r, "Ok")
}
