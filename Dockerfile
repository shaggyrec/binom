FROM golang:latest

RUN export GOPATH=$HOME/go
RUN export PATH=$PATH:$GOPATH/bin

WORKDIR /goapp

ADD server/ server
ADD scripts/ ./scripts
ADD db/migrations/ ./db/migrations
ADD go.mod ./
ADD go.sum ./
ADD main.go ./

RUN go mod download
RUN go install github.com/mitranim/gow@latest
RUN go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

RUN go build -o main .