package dataType

import (
	"github.com/go-pg/pg"
	"net/mail"
)

type SentEmail struct {
	Id string `json:"id"`
	Sender mail.Address `json:"sender"`
	Recipient []string `json:"recipient"`
	Subject string `json:"subject"`
	Body string `json:"body"`
	Created pg.NullTime `json:"created"`
}
