package main

import (
	"binom/server"
	"binom/server/functions"
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
	log.Print("Starting server on port " + appPort)
	err := http.ListenAndServe(
		":" + appPort,
		server.Init(
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
