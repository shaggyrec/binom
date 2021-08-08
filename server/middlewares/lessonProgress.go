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

func LessonProgress(learningProgressService *service.LearningProgressService, lessonStorage *storage.LessonStorage, topicStorage *storage.TopicStorage) func(next http.Handler) http.Handler {
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
					topicsWithProgress, err := topicStorage.List(1000, 0, false, userId)
					if err != nil {
						log.Print(err)
						exceptions.ServerError(w, r)
						return
					}
					var isPrevTopicFinished bool
					for i, topic := range *topicsWithProgress {
						if topic.Id == l.TopicId {
							if isPrevTopicFinished || i == 0 {
								break
							} else {
								exceptions.Forbidden(w, r, "You must to pass previous Theme")
								return
							}
						}
						isPrevTopicFinished = topic.Status.Finished != ""
					}

					_, err = learningProgressService.Save(lessonAlias, userId)
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
