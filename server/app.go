package server

import (
	"binom/server/controllers"
	"binom/server/service"
	"binom/server/storage"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-pg/pg"
	"net/http"
)

func Init(db *pg.DB) *chi.Mux {
	// storages
	authCodeStorage := storage.AuthCode(db)
	// services
	seviceFactory := service.Factory{};
	authCodeService := seviceFactory.AuthCodeService(authCodeStorage)

	// controllers
	authController := controllers.AuthController{}
	authController.Init(authCodeService)
	pageController := controllers.PageController{}


	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Get("/monitoring", func(w http.ResponseWriter, r *http.Request) {
		_, err := db.Exec("SELECT 1")
		if err != nil {
			panic("Database is not working")
		}
		w.Write([]byte("hello from binom"))
	})
	r.Get("/", pageController.Main)
	r.Route("/api" , func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Post("/email", authController.Email)
			r.Post("/code", authController.CheckCodeAndAuth)
		})
	})
	return r
}
