package middlewares

import (
	"binom/server/dataType"
	"encoding/json"
	"net/http"
	"time"
)

func Utm(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hasUtm := false
		for _, p := range dataType.UtmQueryParams {
			if r.URL.Query().Get(p) != "" {
				hasUtm = true
				break
			}
		}
		if hasUtm {
			var utm = dataType.Utm{
				UtmCampaign: r.URL.Query().Get("utm_campaign"),
				UtmSource:   r.URL.Query().Get("utm_source"),
				UtmMedium:   r.URL.Query().Get("utm_medium"),
				UtmContent:  r.URL.Query().Get("utm_content"),
				UtmTerm:     r.URL.Query().Get("utm_term"),
				Url:         r.URL.Query().Get("url"),
				UserId:      r.Context().Value("userId").(string),
			}
			jsonUtm, _ := json.Marshal(utm)
			r.AddCookie(&http.Cookie{Name: "binomUtm", Value: string(jsonUtm), Path: "/", Expires: time.Now().AddDate(1, 0,0 )})
		}
		next.ServeHTTP(w, r)
	})
}
