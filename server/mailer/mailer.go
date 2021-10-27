package mailer

import (
	"binom/server/dataType"
	"binom/server/functions"
	"binom/server/storage"
	"bytes"
	"html/template"
	"log"
	"net/mail"
	"net/smtp"
	"path/filepath"
	"runtime"
	"strings"
)

const domain = "binom.school"
var from = &mail.Address{Name: "Binom", Address: "notify@" + domain}

var smptMailConfig = struct {
	host string
	port string
	from string
	pwd string
} {
	"smtp.mail.ru",
	"25",
	"notify@binom.school",
	"ei&UVTpro9T4",
}

type Mailer struct {
	sentEmailStorage *storage.SentEmailStorage
}

func (m *Mailer) Init(sentEmailStorage *storage.SentEmailStorage)  {
	m.sentEmailStorage = sentEmailStorage
}

func (m *Mailer) Mail(to []string, subject string, body interface{}, emailType EmailType) error {
	return m.send(to, subject, body, emailType, 2)
}

func (m *Mailer) send(to []string, subject string, body interface{}, emailType EmailType, tries int) error {
	var messageBody bytes.Buffer
	tpl := messageTemplate(emailType)
	err := tpl.Execute(&messageBody, body)

	if err != nil {
		log.Panic(err)
	}

	auth := smtp.PlainAuth("", smptMailConfig.from, smptMailConfig.pwd , smptMailConfig.host)

	msg := []byte("To: " + strings.Join(to, ",") + "\r\n" +
		"Subject: " + subject +"\r\n" +
		"Content-Type: text/html; charset=\"UTF-8\"\r\n" +
		"MIME-Version: 1.0\r\n" +
		"\r\n" +
		messageBody.String() + "\r\n")

	err = smtp.SendMail(smptMailConfig.host + ":" + smptMailConfig.port, auth, smptMailConfig.from, to, msg)

	if err != nil && tries > 0 {
		log.Println(tries)
		return m.send(to, subject, body, emailType, tries - 1)
	}

	if err == nil {
		m.sentEmailStorage.Create(&dataType.SentEmail{
			Sender:    *from,
			Recipient: to,
			Subject:   subject,
			Body:      messageBody.String(),
		})
	}

	return err
}

func messageTemplate(emailType EmailType) *template.Template {
	return template.Must(template.ParseGlob(filepath.Join(functions.CurrPath(runtime.Caller(0)), "templates",  string(emailType) + ".html")))
}