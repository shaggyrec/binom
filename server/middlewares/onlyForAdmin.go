package middlewares

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"net/http"
)

func OnlyForAdmin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userRole := r.Context().Value("userRole").(int)
		if userRole != dataType.UserRoleAdmin {
			exceptions.Forbidden(w, r, "You have no access to this route")
			return
		}
		next.ServeHTTP(w, r)
	})
}