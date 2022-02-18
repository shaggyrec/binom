package middlewares

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/storage"
	"context"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-pg/pg"
	"github.com/google/uuid"
	"net/http"
	"strings"
)

func AccessToLesson(db *pg.DB, userSubscriptionStorage *storage.UserSubscriptionStorage) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userRole := r.Context().Value("userRole")
			userId := r.Context().Value("userId").(string)
			isDemo := false
			_, err := uuid.Parse(chi.URLParam(r, "alias"))
			where := "l.alias = ?"
			if err == nil {
				where = "l.id = ?"
			}

			if userRole != dataType.UserRoleAdmin {
				subscriptions := userSubscriptionStorage.ByUserId(userId, []int{dataType.StatusLive})
				if len(*subscriptions) == 0 {
					isDemo = true
				}
				var paidTopics []string
				for _, s := range *subscriptions {
					paidTopics = append(paidTopics, s.Topics...)
				}

				topicsClause := ""

				if len(paidTopics) > 0 {
					topicsClause = fmt.Sprintf(" OR id IN (%s)", strings.Join(paidTopics, ","))
				}

				res, err := db.ExecOne(
					fmt.Sprintf(`SELECT 1 FROM topics t
									LEFT JOIN lessons l ON t.id = l.topic_id
								WHERE %s AND t.id IN (SELECT id FROM topics WHERE price = 0 %s)`, where, topicsClause),
					chi.URLParam(r, "alias"),
				)
				if res == nil || err != nil {
					exceptions.Forbidden(w, r, "Необходимо оформить подписку")
					return
				}

			}
			next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), "demo", isDemo)))
		})
	}
}
