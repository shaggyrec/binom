package middlewares

import (
	"net/http"
)

func AccessToLesson(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// TODO implement checking access to lesson considering user subscription
		next.ServeHTTP(w, r)
	})
}