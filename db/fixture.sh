#!/usr/bin/env bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

PGPASSWORD=$POSTGRES_PASSWORD psql -h postgres -U postgres -d postgres_test -c "SELECT pid, pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid();"
PGPASSWORD=$POSTGRES_PASSWORD psql -h postgres -U postgres -d postgres -c "DROP DATABASE IF EXISTS \"postgres_test\";"
PGPASSWORD=$POSTGRES_PASSWORD psql -h postgres -U postgres -d postgres -c "CREATE DATABASE \"postgres_test\";"
PGPASSWORD=$POSTGRES_PASSWORD psql -h postgres -U postgres -d postgres_test < ${DIR}/fixture.sql
