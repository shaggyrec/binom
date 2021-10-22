package server

import (
	"binom/server/controllers"
	"binom/server/dependencyContainer"
	"binom/server/middlewares"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-pg/pg"
	"net/http"
)

func Init(dc *dependencyContainer.DC, db *pg.DB, jwtSecret, uploadPath, host, version string) *chi.Mux {
	// controllers
	authController := controllers.AuthController{}
	authController.Init(dc.Services.AuthCode, dc.Services.Auth, dc.Services.Token, dc.Storages.User)
	pageController := controllers.PageController{}
	pageController.Init(dc.Storages.Topic, dc.Storages.Lesson, dc.Storages.Tariff, host, version)
	userController := controllers.UserController{}
	userController.Init(dc.Storages.User)
	topicController := controllers.TopicController{}
	topicController.Init(dc.Storages.Topic, dc.Services.MoveAtPosition)
	lessonController := controllers.LessonController{}
	lessonController.Init(dc.Storages.Lesson, dc.Services.MoveAtPosition)
	fileController := controllers.FileController{}
	fileController.Init(uploadPath, dc.Storages.File)
	lessonCommentController := controllers.LessonCommentController{}
	lessonCommentController.Init(dc.Storages.LessonComment, dc.Services.Notification, dc.Storages.User)
	notificationController := controllers.NotificationController{}
	notificationController.Init(dc.Services.Notification)
	learningProgressController := controllers.LearningProgressController{}
	learningProgressController.Init(dc.Services.LessonProgress, dc.Services.Notification, dc.Services.UserScore)
	tariffController := controllers.TariffController{}
	tariffController.Init(dc.Storages.Tariff, dc.Storages.TariffPrice, dc.Storages.UserSubscription, dc.Services.YooMoney)
	paymentController := controllers.PaymentController{}
	paymentController.Init(dc.Services.YooMoney, dc.Storages.Transaction, dc.Storages.UserSubscription, dc.Services.Notification)
	usersRatingController := controllers.UsersRatingController{}
	usersRatingController.Init(dc.Services.UserScore)
	postController := controllers.PostController{}
	postController.Init(dc.Storages.PostStorage)

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
	r.Get("/privacy", pageController.Privacy)
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
		r.Route("/payment", func(r chi.Router) {
			r.Post("/yoomoney", paymentController.YooMoney)
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
					r.Use(middlewares.AccessToLesson(db, dc.Storages.UserSubscription))
					r.Use(middlewares.LessonProgress(dc.Services.LessonProgress, dc.Storages.Lesson, dc.Storages.Topic))
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
			})
			r.Route("/tariff", func(r chi.Router) {
				r.Get("/", tariffController.List)
				r.Get("/special", tariffController.SpecialTariff)
				r.Get("/{tariffId}/price/{priceId}/buy", tariffController.Buy)
				r.Get("/special/buy", tariffController.BuySpecialTariff)
				r.Group(func(r chi.Router) {
					r.Use(middlewares.OnlyForAdmin)
					r.Post("/", tariffController.Create)
					r.Put("/{id}", tariffController.Update)
					r.Delete("/{id}", tariffController.Delete)
					r.Route("/{tariffId}/price", func(r chi.Router) {
						r.Post("/", tariffController.CreatePrice)
						r.Put("/{id}", tariffController.UpdatePrice)
						r.Delete("/{id}", tariffController.DeletePrice)
					})
				})
			})
			r.Route("/rating", func(r chi.Router) {
				r.Get("/{year}", usersRatingController.ByYear)
			})
			r.Route("/posts", func(r chi.Router) {
				r.Get("/", postController.List)
				r.Get("/user/{user}", postController.List)
				r.Post("/", postController.Create)
				r.Put("/{id}", postController.Update)
				r.Delete("/{id}", postController.Delete)
				r.Patch("/{id}/like", postController.Like)
			})
		})
	})
	r.Get("/m", pageController.MiniLanding)
	r.Get("/*", pageController.App)
	return r
}
