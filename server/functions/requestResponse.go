package functions

import (
	"binom/server/exceptions"
	"encoding/json"
	"github.com/go-chi/render"
	"log"
	"net/http"
	"reflect"
)

func ParseRequest(w http.ResponseWriter, r *http.Request, b interface{}) error {
	err := json.NewDecoder(r.Body).Decode(b)
	if err != nil {
		log.Println(err.Error())
		exceptions.BadRequestError(w, r, "Can't parse body", http.StatusBadRequest)
	}
	return err
}


func RenderJSON(w http.ResponseWriter, r *http.Request, response interface{}) {
	switch reflect.TypeOf(response).Kind() {
		case reflect.Slice:
			arr := reflect.ValueOf(response)
			if arr.Len() > 0 {
				render.JSON(w, r, response)
			} else {
				render.JSON(w, r, make([]string, 0))
			}
		default:
			render.JSON(w, r, response)
	}
}