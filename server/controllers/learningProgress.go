package controllers

import (
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/requests"
	"binom/server/responses"
	"binom/server/service"
	"github.com/go-chi/chi"
	"net/http"
)

type LearningProgressController struct {
	lessonProgressService *service.LearningProgressService
}

func (s *LearningProgressController) Init(lessonProgressService *service.LearningProgressService) {
	s.lessonProgressService = lessonProgressService
}

func (s *LearningProgressController) UsersProgressByLesson(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "userId")
	lessonAlias := chi.URLParam(r, "lessonAlias")

	isPassed, err := s.lessonProgressService.IsLessonPassed(lessonAlias, userId)

	if err != nil {
		exceptions.BadRequestError(w, r, err.Error(), 0)
		return
	}

	functions.RenderJSON(w, r, responses.UsersProgressByLessonResponse{Passed: isPassed})
}

func (s *LearningProgressController) UpdateUsersProgressByLesson(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "userId")
	lessonAlias := chi.URLParam(r, "lessonAlias")

	var request requests.UpdateUsersProgressByLessonRequest

	err := functions.ParseRequest(w, r, &request)

	if err != nil {
		exceptions.BadRequestError(w, r, err.Error(), exceptions.ErrorBadParam)
		return
	}

	if request.Passed {
		err = s.lessonProgressService.Pass(lessonAlias, userId)
	} else {
		err = s.lessonProgressService.Save(lessonAlias, userId)
	}

	functions.RenderJSON(w, r, "Ok")
}