package middlewares

import (
	"context"
	"net/http"
)

func ParseAuthTokenFromQueryString (next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenCookie, err := r.Cookie("access_token")

		if err != nil || tokenCookie == nil || tokenCookie.Value == "" {
			next.ServeHTTP(w, r)
			return
		}
		next.ServeHTTP(
			w,
			r.WithContext(context.WithValue(r.Context(), "token", tokenCookie.Value)),
		)
	})
}
