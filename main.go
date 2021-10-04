package main

import (
	"binom/server"
	"binom/server/dependencyContainer"
	"binom/server/functions"
	"binom/server/scheduler"
	"binom/server/telegramBot"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
)

func main() {
	godotenv.Load()

	appPort := os.Getenv("APP_PORT")
	pgUser := os.Getenv("POSTGRES_USER")
	pgDbName := os.Getenv("POSTGRES_DB_NAME")
	pgHost := os.Getenv("POSTGRES_HOST")
	pgPwd := os.Getenv("POSTGRES_PASSWORD")

	functions.RunMigrations(pgUser, pgHost, pgDbName, pgPwd)

	db := functions.DbConnection(pgUser, pgHost, pgDbName, pgPwd)
	defer db.Close()

	tgBot := &telegramBot.BotForChat{}

	if os.Getenv("MODE") == "PROD" {
		tgBot = telegramBot.InstantiateBotForChat(
			telegramBot.Instantiate(os.Getenv("TELEGRAM_BOT_TOKEN")),
			os.Getenv("TELEGRAM_TECHNICAL_CHAT_ID"),
		)
	}

	dc := dependencyContainer.New(db, os.Getenv("HOST"), os.Getenv("JWT_SECRET"), tgBot)

	log.Println("Starting scheduler")
	s := scheduler.New(db, dc.Services.Notification)
	s.Run()

	log.Print("Starting server on port " + appPort)
	err := http.ListenAndServe(
		":" + appPort,
		server.Init(
			dc,
			db, os.Getenv("JWT_SECRET"),
			os.Getenv("UPLOAD_PATH"),
			os.Getenv("HOST"),
			os.Getenv("GIT_COMMIT"),
		),
	)
	if err != nil {
		log.Panic(err)
	}
}
