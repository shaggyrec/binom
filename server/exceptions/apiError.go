package exceptions

import (
	"github.com/go-chi/render"
	"net/http"
)

type ApiError struct {
	Code int `json:"code"`
	Message string `json:"message"`
}

func BadRequestError (w http.ResponseWriter, r *http.Request, message string, code int)  {
	sendHttpError(w, r, http.StatusBadRequest, ApiError{ code, message })
}

func NotFoundError (w http.ResponseWriter, r *http.Request, message string)  {
	sendHttpError(w, r, http.StatusNotFound, ApiError{ Message: message })
}

func Forbidden (w http.ResponseWriter, r *http.Request, message string)  {
	sendHttpError(w, r, http.StatusForbidden, ApiError{ Message: message })
}

func UnauthorizedError (w http.ResponseWriter, r *http.Request, message string, code int)  {
	sendHttpError(w, r, http.StatusUnauthorized, ApiError{ Message: message, Code: code})
}

func ServerError (w http.ResponseWriter, r *http.Request) {
	sendHttpError(w, r, http.StatusInternalServerError, ApiError{ Code: ErrorUnexpectedServer, Message: "Something went wrong"})
}

func sendHttpError(w http.ResponseWriter, r *http.Request, status int, error ApiError)  {
	render.Status(r, status)
	render.JSON(w, r, error)
}
