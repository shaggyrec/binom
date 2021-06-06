package functions

import (
	"encoding/json"
	"net/http"
)

func ParseRequest(w http.ResponseWriter, r *http.Request, b interface{}) error {
	err := json.NewDecoder(r.Body).Decode(b)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	return err
}
