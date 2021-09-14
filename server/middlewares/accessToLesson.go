package middlewares

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/storage"
	"github.com/go-chi/chi"
	"github.com/go-pg/pg"
	"net/http"
)

func AccessToLesson(db *pg.DB, userSubscriptionStorage *storage.UserSubscriptionStorage) func(next http.Handler) http.Handler {
	return func (next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userRole := r.Context().Value("userRole")
			userId := r.Context().Value("userId").(string)
			if userRole != dataType.UserRoleAdmin {
				subscriptions := userSubscriptionStorage.ByUserId(userId, []int{dataType.StatusLive})
				if len(*subscriptions) == 0 {
					res, err := db.ExecOne(
						`SELECT 1 FROM topics t
									LEFT JOIN lessons l ON t.id = l.topic_id
								WHERE l.alias = ? AND t.id IN (SELECT id FROM topics ORDER BY pos, created ASC LIMIT 2)`,
						chi.URLParam(r, "alias"),
					)
					if res == nil || err != nil {
						exceptions.Forbidden(w, r, "Необходимо оформить подписку")
						return
					}
				}
			}
			next.ServeHTTP(w, r)
	})}
}