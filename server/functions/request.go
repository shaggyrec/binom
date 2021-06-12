package functions

import (
	"binom/server/exceptions"
	"encoding/json"
	"net/http"
)

func ParseRequest(w http.ResponseWriter, r *http.Request, b interface{}) error {
	err := json.NewDecoder(r.Body).Decode(b)
	if err != nil {
		exceptions.BadRequestError(w, r, "Can't parse body", http.StatusBadRequest)
	}
	return err
}
