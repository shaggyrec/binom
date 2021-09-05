FROM golang:latest

RUN export GOPATH=$HOME/go
RUN export PATH=$PATH:$GOPATH/bin

WORKDIR /goapp

ADD server/ server
ADD scripts/ ./scripts
ADD go.mod ./
ADD go.sum ./
ADD main.go ./

ADD etc/update-exim4.conf.conf /etc/exim4/update-exim4.conf.conf

RUN apt-get update && apt-get install -y
RUN echo "postfix postfix/mailname string binommath.ru" | debconf-set-selections &&\
        echo "postfix postfix/main_mailer_type string 'Binom Maths'" | debconf-set-selections &&\
        apt-get install -y mailutils

RUN go mod download
RUN go install github.com/mitranim/gow@latest
RUN go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

RUN go build -o main .