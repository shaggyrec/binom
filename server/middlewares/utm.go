package middlewares

import (
	"binom/server/dataType"
	"binom/server/storage"
	"context"
	"net/http"
	"time"
)

func Utm(storage *storage.UtmStorage) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			hasUtm := false
			for _, p := range dataType.UtmQueryParams {
				if r.URL.Query().Get(p) != "" {
					hasUtm = true
					break
				}
			}

			cookie, _ := r.Cookie(dataType.UtmCookieName)
			if hasUtm {
				if cookie == nil {
					var utm = dataType.Utm{
						UtmCampaign: r.URL.Query().Get("utm_campaign"),
						UtmSource:   r.URL.Query().Get("utm_source"),
						UtmMedium:   r.URL.Query().Get("utm_medium"),
						UtmContent:  r.URL.Query().Get("utm_content"),
						UtmTerm:     r.URL.Query().Get("utm_term"),
						Url:         r.URL.Query().Get("url"),
					}
					storage.Create(&utm)
					cookie = &http.Cookie{Name: dataType.UtmCookieName, Value: utm.Id, Path: "/", Expires: time.Now().AddDate(1, 0, 0)}
					http.SetCookie(w, cookie)
					r.AddCookie(cookie)
				}
			}

			if cookie != nil {
				utm, err := storage.ById(cookie.Value)
				if err == nil {
					r = r.WithContext(context.WithValue(r.Context(), "utm", utm))
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}
