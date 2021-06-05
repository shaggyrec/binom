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

	pgUser := os.Getenv("POSTGRES_USER")
	pgDbName := os.Getenv("POSTGRES_DB_NAME")
	pgHost := os.Getenv("POSTGRES_HOST")
	pgPwd := os.Getenv("POSTGRES_PASSWORD")

	functions.RunMigrations(pgUser, pgHost, pgDbName, pgPwd)

	db := functions.DbConnection(pgUser, pgHost, pgDbName, pgPwd)
	defer db.Close()
	log.Print("Starting server on port 4030")
	err := http.ListenAndServe(":4030", server.Init(db))
	if err != nil {
		log.Panic(err)
	}
}
