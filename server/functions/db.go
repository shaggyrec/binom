package functions

import (
	"errors"
	"fmt"
	"github.com/go-pg/pg"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"os"
)

func DbConnection (user string, host string, dbName string, pwd string) *pg.DB {
	return pg.Connect(&pg.Options{
		Addr: host + ":5432",
		User: user,
		Database: dbName,
		Password: pwd,
	})
}

func RunMigrations(user string, host string, dbName string, pwd string) {
	dbURL := fmt.Sprintf(
		"%s:%s@%s:%s/%s?sslmode=disable",
		user,
		pwd,
		host,
		"5432",
		dbName,
	)
	m, err := migrate.New("file://db/migrations/", "postgresql://" + dbURL)
	if err != nil {
		panic(err)
	}
	err = m.Steps(1000)
	// TODO fix/skip `limit 999 short`
	if err != nil && !errors.Is(err, os.ErrNotExist) {
		panic(err)
	}
}
