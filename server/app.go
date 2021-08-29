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
	lessonCommentStorage := storageFactory.LessonComment(db)
	notificationStorage := storageFactory.Notification(db)
	subscriptionStorage := storageFactory.Subscription(db)
	// services
	serviceFactory := service.Factory{}
	tokenService := serviceFactory.TokenService(jwtSecret, tokenStorage)
	authCodeService := serviceFactory.AuthCodeService(authCodeStorage)
	authService := serviceFactory.AuthService(userStorage, tokenService)
	moveAtPositionService := serviceFactory.MoveAtPosition(db)
	notificationService := serviceFactory.Notification(notificationStorage, userStorage)
	lessonProgressService := serviceFactory.LessonProgress(db)

	// controllers
	authController := controllers.AuthController{}
	authController.Init(authCodeService, authService, tokenService, userStorage)
	pageController := controllers.PageController{}
	pageController.Init()
	userController := controllers.UserController{}
	userController.Init(userStorage)
	topicController := controllers.TopicController{}
	topicController.Init(topicStorage, moveAtPositionService)
	lessonController := controllers.LessonController{}
	lessonController.Init(lessonStorage, moveAtPositionService)
	fileController := controllers.FileController{}
	fileController.Init(uploadPath, fileStorage)
	lessonCommentController := controllers.LessonCommentController{}
	lessonCommentController.Init(lessonCommentStorage, notificationService, userStorage)
	notificationController := controllers.NotificationController{}
	notificationController.Init(notificationService)
	learningProgressController := controllers.LearningProgressController{}
	learningProgressController.Init(lessonProgressService, notificationService)
	subscriptionController := controllers.SubscriptionController{}
	subscriptionController.Init(subscriptionStorage)

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
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
	r.Group(func(r chi.Router) {
		r.Use(middlewares.ParseAuthTokenFromQueryString)
		r.Use(middlewares.JwtAuth(jwtSecret))
		r.Get("/file/{id}", fileController.Serve)
	})
	r.Route("/api" , func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Post("/email", authController.Email)
			r.Post("/code", authController.CheckCodeAndAuth)
			r.Post("/refresh", authController.RefreshToken)
		})
		r.Group(func(r chi.Router) {
			r.Use(middlewares.JwtAuth(jwtSecret))
			r.Get("/me", userController.Me)
			r.Route("/user", func(r chi.Router) {
				r.Group(func(r chi.Router) {
					r.Use(middlewares.AccessToUser)
					r.Put("/{userId}", userController.Update)
				})
				r.Get("/{username}", userController.ByUsername)
			})
			r.Route("/topic", func(r chi.Router) {
				r.Get("/list", topicController.List)
				r.Get("/{alias}", topicController.ByAlias)
				r.Group(func(r chi.Router) {
					r.Use(middlewares.OnlyForAdmin)
					r.Post("/", topicController.Create)
					r.Put("/{id}", topicController.Update)
					r.Delete("/{id}", topicController.Delete)
					r.Patch("/{id}/at/{pos:[0-9]+}", topicController.MoveAtPosition)
				})
			})

			r.Route("/lesson", func(r chi.Router) {
				r.Group(func(r chi.Router) {
					r.Use(middlewares.LessonProgress(lessonProgressService, lessonStorage, topicStorage))
					r.Get("/{alias}", lessonController.GetOneLesson)
				})
				r.Group(func(r chi.Router) {
					r.Use(middlewares.OnlyForAdmin)
					r.Post("/", lessonController.Create)
					r.Put("/{id}", lessonController.Update)
					r.Delete("/{id}", lessonController.Delete)
					r.Patch("/{id}/at/{pos:[0-9]+}", lessonController.MoveAtPosition)
				})
			})
			r.Route("/lesson/{lesson}/{userId}/comment", func(r chi.Router) {
				r.Use(middlewares.AccessToUser)
				r.Get("/", lessonCommentController.List)
				r.Post("/", lessonCommentController.Add)
			})
			r.Route("/file", func(r chi.Router) {
				r.Post("/", fileController.Upload)
				r.Get("/{id}", fileController.GetInfo)
				r.Delete("/{id}", fileController.Delete)
			})
			r.Route("/notification", func(r chi.Router) {
				r.Get("/", notificationController.List)
				r.Patch("/{id}/viewed", notificationController.Viewed)
			})
			r.Group(func(r chi.Router) {
				r.Use(middlewares.OnlyForAdmin)
				r.Route("/progress", func(r chi.Router) {
					r.Put("/{userId}/{lessonAlias}", learningProgressController.UpdateUsersProgressByLesson)
					r.Get("/{userId}/{lessonAlias}", learningProgressController.UsersProgressByLesson)
				})
				r.Route("/subscription", func(r chi.Router) {
					r.Get("/", subscriptionController.List)
					r.Post("/", subscriptionController.Create)
					r.Put("/{id}", subscriptionController.Update)
					r.Delete("/{id}", subscriptionController.Delete)
				})
			})
		})
	})
	r.Get("/*", pageController.App)
	return r
}
