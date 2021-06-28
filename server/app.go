package server

import (
	"binom/server/controllers"
	"binom/server/middlewares"
	"binom/server/service"
	"binom/server/storage"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-pg/pg"
	"net/http"
)

func Init(db *pg.DB, jwtSecret string, uploadPath string) *chi.Mux {
	// storages
	storageFactory := &storage.Factory{}
	authCodeStorage := storageFactory.AuthCode(db)
	tokenStorage := storageFactory.Token(db)
	userStorage := storageFactory.User(db)
	topicStorage := storageFactory.Topic(db)
	lessonStorage := storageFactory.Lesson(db)
	fileStorage := storageFactory.File(db)
	// services
	serviceFactory := service.Factory{}
	tokenService := serviceFactory.TokenService(jwtSecret, tokenStorage)
	authCodeService := serviceFactory.AuthCodeService(authCodeStorage)
	authService := serviceFactory.AuthService(userStorage, tokenService)

	// controllers
	authController := controllers.AuthController{}
	authController.Init(authCodeService, authService, tokenService)
	pageController := controllers.PageController{}
	userController := controllers.UserController{}
	userController.Init(userStorage)
	topicController := controllers.TopicController{}
	topicController.Init(topicStorage)
	lessonController := controllers.LessonController{}
	lessonController.Init(lessonStorage)
	fileController := controllers.FileController{}
	fileController.Init(uploadPath, fileStorage)


	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
	}))
	r.Use(middlewares.ParseAuthHeader)

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
			r.Post("/refresh", authController.RefreshToken)
		})
		r.Group(func(r chi.Router) {
			r.Use(middlewares.JwtAuth(jwtSecret))
			r.Get("/me", userController.Me)
			r.Route("/topic", func(r chi.Router) {
				r.Get("/list", topicController.List)
				r.Get("/{alias}", topicController.ByAlias)
				r.Post("/", topicController.Create)
				r.Put("/{id}", topicController.Update)
				r.Delete("/{id}", topicController.Delete)
				// r.Get("/{id}")
			})

			r.Route("/lesson", func(r chi.Router) {
				//r.Get("/{id}", lessonController.ById)
				r.Get("/{alias}", lessonController.ByAlias)
				r.Post("/", lessonController.Create)
				r.Put("/{id}", lessonController.Update)
				r.Delete("/{id}", lessonController.Delete)
			})
			r.Route("/file", func(r chi.Router) {
				r.Post("/", fileController.Upload)
				r.Get("/{id}", fileController.Get)
			})
		})
	})
	return r
}
