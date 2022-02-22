package middlewares

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/service"
	"binom/server/storage"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"net/http"
)

func LessonProgress(learningProgressService *service.ProgressService, lessonStorage *storage.LessonStorage, topicStorage *storage.TopicStorage) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			userRole := r.Context().Value("userRole")

			if userRole != dataType.UserRoleAdmin {
				lessonAlias := chi.URLParam(r, "alias")
				var lesson *dataType.Lesson
				_, err := uuid.Parse(lessonAlias)
				if err != nil {
					lesson, err = lessonStorage.GetByAlias(lessonAlias)
				} else {
					lesson, err = lessonStorage.GetById(lessonAlias)
				}

				if err != nil {
					exceptions.ServerError(w, r)
					return
				}

				userId := r.Context().Value("userId").(string)

				if err := learningProgressService.AssertLessonAllowed(lesson, userId); err != nil {
					exceptions.Forbidden(w, r, err.Error())
					return
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}
