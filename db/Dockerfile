FROM postgres:13
MAINTAINER Alexander Shogenov

WORKDIR /db

ADD fixture.sql ./
ADD fixture.sh ./
ADD fixture.sh ./
ADD docker-entrypoint-initdb.d /docker-entrypoint-initdb.d
ADD dump-fixture.sh ./
