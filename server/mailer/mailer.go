package mailer

import (
	"binom/server/functions"
	"github.com/shaggyrec/sendmail"
	"html/template"
	"log"
	"net/mail"
	"path/filepath"
	"runtime"
)

const domain = "binom.school"
var from = &mail.Address{Name: "Binom", Address: "notify@" + domain}


func Mail(to []string, subject string, body interface{}, emailType EmailType) error {
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
		log.Panic(err)
	}

	sm.Header.Set("MIME-Version", "1.0")
	sm.Header.Set("Content-type", `text/html; charset="UTF-8"`)


	if err := sm.Send(); err != nil {
		panic(err)
		return err
	}

	return nil
}

func messageTemplate(emailType EmailType) *template.Template {
	return template.Must(template.ParseGlob(filepath.Join(functions.CurrPath(runtime.Caller(0)), "templates",  string(emailType) + ".html")))
}