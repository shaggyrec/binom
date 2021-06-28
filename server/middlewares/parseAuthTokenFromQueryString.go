package middlewares

import (
	"context"
	"net/http"
)

func ParseAuthTokenFromQueryString (next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := r.URL.Query().Get("t")
		if token == "" {
			next.ServeHTTP(w, r)
			return
		}

		next.ServeHTTP(
			w,
			r.WithContext(context.WithValue(r.Context(), "token", token)),
		)
	})
}
