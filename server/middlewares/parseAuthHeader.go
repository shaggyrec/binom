package middlewares

import (
	"context"
	"net/http"
	"strings"
)

func ParseAuthHeader (next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorizationHeader := r.Header.Get("Authorization")

		if authorizationHeader == "" {
			next.ServeHTTP(w, r)
			return
		}

		next.ServeHTTP(
			w,
			r.WithContext(context.WithValue(r.Context(), "token", strings.Split(authorizationHeader, "Bearer ")[1])),
		)
	})
}
