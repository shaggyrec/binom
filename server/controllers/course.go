package controllers

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/storage"
	"fmt"
	"github.com/go-chi/chi"
	"log"
	"net/http"
)

type CourseController struct {
	storage *storage.CourseStorage
}

func (c *CourseController) Init(storage *storage.CourseStorage) {
	c.storage = storage
}

func (c *CourseController) ById(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value("userId").(string)
	userRole := r.Context().Value("userRole").(int)

	userIdForListRequest := ""

	if userRole != dataType.UserRoleAdmin {
		userIdForListRequest = userId
	}

	course, err := c.storage.GetById(chi.URLParam(r, "id"), userIdForListRequest)

	if err != nil {
		fmt.Println(err)
		exceptions.NotFoundError(w, r, "Course not found")
		return
	}

	functions.RenderJSON(w, r, course)
}

func (c *CourseController) List(w http.ResponseWriter, r *http.Request) {
	courses, err := c.storage.List()

	if err != nil {
		log.Println(err)
		exceptions.ServerError(w, r)
		return
	}

	functions.RenderJSON(w, r, courses)
}
