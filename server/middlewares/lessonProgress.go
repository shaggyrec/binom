package middlewares

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/service"
	"binom/server/storage"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"log"
	"net/http"
)

func LessonProgress(learningProgressService *service.LearningProgressService, lessonStorage *storage.LessonStorage) func(next http.Handler) http.Handler {
	return func (next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			userRole :=r.Context().Value("userRole")

			if userRole != dataType.UserRoleAdmin {
				lessonAlias := chi.URLParam(r, "alias")
				_, err := uuid.Parse(lessonAlias)
				if err == nil {
					 l, err := lessonStorage.GetById(lessonAlias)
					 if err != nil {
					 	exceptions.ServerError(w, r)
					 	return
					 }
					lessonAlias = l.Alias.String
				}

				userId := r.Context().Value("userId").(string)
				l, _ := learningProgressService.ProgressLevelByLessonAlias(lessonAlias, userId)
				if l.LessonId == "" {
					_, err := learningProgressService.Save(lessonAlias, userId)
					if err != nil {
						log.Print(err)
						exceptions.ServerError(w, r)
						return
					}
				} else {
					if functions.IndexOf(l.PassedLessonsAliases, lessonAlias) == -1 {
						exceptions.Forbidden(w, r, "You must to pass previous lessons")
						return
					}
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}
