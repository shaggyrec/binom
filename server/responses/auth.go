package responses

import "binom/server/dataType"

type CheckCodeAndAuthResponse struct {
	User *dataType.User `json:"user"`
	Tokens map[string]string `json:"tokens"`
}
