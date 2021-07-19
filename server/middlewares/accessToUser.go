package middlewares

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"github.com/go-chi/chi"
	"net/http"
)

func AccessToUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userRole :=r.Context().Value("userRole")

		if userRole != dataType.UserRoleAdmin {
			userId := r.Context().Value("userId").(string)
			userUrlParam := chi.URLParam(r, "userId")

			if userId != userUrlParam {
				exceptions.Forbidden(w, r, "You have no access to this route")
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}