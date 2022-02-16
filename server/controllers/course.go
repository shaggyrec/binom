package controllers

import (
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/storage"
	"fmt"
	"github.com/go-chi/chi"
	"net/http"
)

type CourseController struct {
	storage *storage.CourseStorage
}

func (c *CourseController) Init(storage *storage.CourseStorage) {
	c.storage = storage
}

func (c *CourseController) ById(w http.ResponseWriter, r *http.Request) {
	course, err := c.storage.GetById(chi.URLParam(r, "id"))

	if err != nil {
		fmt.Println(err)
		exceptions.NotFoundError(w, r, "Course not found")
		return
	}

	functions.RenderJSON(w, r, course)
}
