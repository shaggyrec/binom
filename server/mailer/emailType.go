package mailer

type EmailType string

const (
	TypeVerificationCode EmailType = "verificationCode"
	TypeNotification EmailType = "notification"
)

func (emailType EmailType) String() string {
	return string(emailType)
}
