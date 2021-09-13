package mailer

import (
	"binom/server/functions"
	"bytes"
	"github.com/shaggyrec/sendmail"
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

func SendMail(to []string, subject string, body interface{}, emailType EmailType) error {
	var toAddresses []*mail.Address

	for _, email := range to {
		toAddresses = append(toAddresses, &mail.Address{Address: email})
	}

	sm := sendmail.Mail{
		Subject: subject,
		From: from,
		To: toAddresses,
		Header: map[string][]string{},
	}

	tpl := messageTemplate(emailType)
	err := tpl.Execute(&sm.Text, body)

	if err != nil {
		log.Println(err)
		return err
	}

	sm.Header.Set("MIME-Version", "1.0")
	sm.Header.Set("Content-type", `text/html; charset="UTF-8"`)


	if err := sm.Send(); err != nil {
		return err
	}

	return nil
}

func SmtpMail(to []string, subject string, body interface{}, emailType EmailType, tries int) error {
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
		return SmtpMail(to, subject, body, emailType, tries - 1)
	}

	return err
}

func messageTemplate(emailType EmailType) *template.Template {
	return template.Must(template.ParseGlob(filepath.Join(functions.CurrPath(runtime.Caller(0)), "templates",  string(emailType) + ".html")))
}