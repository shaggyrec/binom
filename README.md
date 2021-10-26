# Binom Maths app using GoLang & React

## Build docker
    docker-compose build

## Run app

    docker-compose up

Application will run on 4030 port

## To develop frontend

    npm start

React developing will run on 1234 port

## Migrations

Create migration

    ./db/create-migration.sh -n <migration name>

Migrations run automatically when app starts

Rollback last migration

    docker-compose exec golang bash
    migrate -source file://db/migrations/  -database postgresql://postgres:set-postgres-pwd@pg:5432/postgres?sslmode=disable down 1