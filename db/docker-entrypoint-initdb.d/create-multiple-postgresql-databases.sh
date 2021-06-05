#!/bin/bash

set -e
set -u

function create_user_and_database() {
  local database=$1
  echo "  Creating user and database '$database'"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	    GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;
EOSQL
}

if [ -n "$POSTGRES_DB_NAME" ]; then
  create_user_and_database $POSTGRES_DB_NAME
  psql -U postgres -d postgres <./fixture.sql
fi

if [ -n "${POSTGRES_DB_NAME_TEST-}" ]; then
  echo "  Creating database '$POSTGRES_DB_NAME_TEST'"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	    CREATE DATABASE $POSTGRES_DB_NAME_TEST;
	    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB_NAME_TEST TO $POSTGRES_USER;
EOSQL
  psql -U postgres -d postgres_test <./fixture.sql
fi
