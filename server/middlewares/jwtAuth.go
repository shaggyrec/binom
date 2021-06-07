package middlewares

import (
	"binom/server/exceptions"
	"context"
	"github.com/dgrijalva/jwt-go"
	"net/http"
)

func JwtAuth(jwtSecret string) func(next http.Handler) http.Handler {
	return func (next http.Handler) http.Handler {
		return http.HandlerFunc(func (w http.ResponseWriter, r *http.Request){
			reqToken, ok := r.Context().Value("token").(string)
			if !ok {
				exceptions.UnauthorizedError(w, r, "No token", exceptions.ErrorBadToken)
				return
			}
			var tClaims = jwt.MapClaims{}

			t, err := jwt.ParseWithClaims(reqToken, &tClaims, func(token *jwt.Token) (interface{}, error) {
				return []byte(jwtSecret), nil
			})

			if err != nil {
				exceptions.UnauthorizedError(w, r, err.Error(), exceptions.ErrorBadToken)
				return
			}

			if !t.Valid {
				exceptions.UnauthorizedError(w, r, "Invalid token", exceptions.ErrorBadToken)
			}

			next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), "userId", tClaims["id"])))
		})
	}
}
