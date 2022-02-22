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
	authController.Init(dc.Services.AuthCode, dc.Services.Auth, dc.Services.Token, dc.Storages.User, dc.Mailer)
	pageController := controllers.PageController{}
	pageController.Init(dc.Storages.Topic, dc.Storages.Lesson, dc.Storages.Tariff, host, version, dc.Storages.QuestionnaireStorage)
	userController := controllers.UserController{}
	userController.Init(dc.Storages.User)
	topicController := controllers.TopicController{}
	topicController.Init(dc.Storages.Topic, dc.Services.MoveAtPosition)
	lessonController := controllers.LessonController{}
	lessonController.Init(dc.Storages.Lesson, dc.Services.MoveAtPosition)
	fileController := controllers.FileController{}
	fileController.Init(uploadPath, dc.Storages.File)
	lessonCommentController := controllers.LessonCommentController{}
	lessonCommentController.Init(dc.Storages.LessonComment, dc.Services.Notification, dc.Storages.User, dc.Storages.ProgressStorage)
	notificationController := controllers.NotificationController{}
	notificationController.Init(dc.Services.Notification)
	learningProgressController := controllers.LearningProgressController{}
	learningProgressController.Init(dc.Services.LearningProgress, dc.Services.Notification, dc.Services.UserScore, dc.Storages.Lesson, dc.Storages.ProgressStorage, dc.Storages.Topic)
	paymentController := controllers.PaymentController{}
	paymentController.Init(dc.Services.YooMoney, dc.Storages.Transaction, dc.Storages.UserSubscription, dc.Services.Notification)
	usersRatingController := controllers.UsersRatingController{}
	usersRatingController.Init(dc.Services.UserScore)
	postController := controllers.PostController{}
	postController.Init(dc.Storages.PostStorage, db)
	postCommentController := controllers.PostCommentController{}
	postCommentController.Init(dc.Storages.PostCommentStorage)
	courseController := controllers.CourseController{}
	courseController.Init(dc.Storages.CourseStorage)
	questionnaireController := controllers.QuestionnaireController{}
	questionnaireController.Init(dc.Storages.QuestionnaireStorage)
	subscriptionController := controllers.SubscriptionController{}
	subscriptionController.Init(dc.Storages.UserSubscription, dc.Storages.Topic, dc.Services.YooMoney)

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
	r.Use(middlewares.Utm(dc.Storages.UtmStorage))

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
		r.Use(middlewares.JwtAuth(jwtSecret, dc.Storages.UtmStorage))
		r.Get("/file/{id}", fileController.Serve)
	})
	r.Route("/api", func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Post("/email", authController.Email)
			r.Post("/code", authController.CheckCodeAndAuth)
			r.Post("/subscribe", authController.Subscribe)
			r.Post("/refresh", authController.RefreshToken)
		})
		r.Route("/payment", func(r chi.Router) {
			r.Post("/yoomoney", paymentController.YooMoney)
		})
		r.Group(func(r chi.Router) {
			r.Use(middlewares.JwtAuth(jwtSecret, dc.Storages.UtmStorage))
			r.Get("/me", userController.Me)
			r.Route("/user", func(r chi.Router) {
				r.Group(func(r chi.Router) {
					r.Use(middlewares.AccessToUser)
					r.Put("/{userId}", userController.Update)
				})
				r.Get("/{username}", userController.ByUsername)
			})
			r.Route("/courses", func(r chi.Router) {
				r.Get("/", courseController.List)
				r.Get("/{id}", courseController.ById)
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
					r.Use(middlewares.LessonProgress(dc.Services.LearningProgress, dc.Storages.Lesson, dc.Storages.Topic))
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
			r.Route("/subscription", func(r chi.Router) {
				r.Post("/", subscriptionController.Buy)
				r.Get("/", subscriptionController.ListOfActive)
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
				r.Route("/{id}/comments", func(r chi.Router) {
					r.Post("/", postCommentController.Create)
					r.Get("/", postCommentController.ListByPostId)
				})
			})
			r.Route("/questionnaire", func(r chi.Router) {
				r.Post("/", questionnaireController.Submit)
			})
		})
	})
	r.Get("/m", pageController.MiniLanding)
	r.Get("/s", pageController.Subscribe)
	r.Get("/*", pageController.App)
	return r
}
