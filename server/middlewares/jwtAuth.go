package middlewares

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/storage"
	"context"
	"github.com/dgrijalva/jwt-go"
	"log"
	"net/http"
	"time"
)

func JwtAuth(jwtSecret string, utmStorage *storage.UtmStorage) func(next http.Handler) http.Handler {
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
			ctx := context.WithValue(r.Context(), "userId", tClaims["id"])
			roleId, _ := tClaims["r"].(float64)
			ctx = context.WithValue(ctx, "userRole", int(roleId))

			if utm, ok := r.Context().Value("utm").(*dataType.Utm); ok {
				if utm.UserId == "" {
					utm.UserId = tClaims["id"].(string)
					http.SetCookie(w, &http.Cookie{Name: dataType.UtmCookieName, Value: "", Path: "/", Expires: time.Unix(0, 0)})
					if _, err = utmStorage.Update(utm); err != nil {
						log.Println(err)
					}
				}
			}

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
