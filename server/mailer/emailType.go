package mailer

type EmailType string

const (
	TypeVerificationCode EmailType = "verificationCode"
)

func (emailType EmailType) String() string {
	return string(emailType)
}
