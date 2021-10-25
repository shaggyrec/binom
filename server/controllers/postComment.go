package controllers

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/storage"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"log"
	"net/http"
	"strconv"
)

type PostCommentController struct {
	storage *storage.PostCommentStorage
}

func (c *PostCommentController) Init(storage *storage.PostCommentStorage) {
	c.storage = storage
}

func (c *PostCommentController) Create(w http.ResponseWriter, r *http.Request) {
	var p dataType.PostComment
	if err := functions.ParseRequest(w, r, &p);  err != nil {
		return
	}

	if p.Text == "" {
		exceptions.BadRequestError(w, r, "`text` is mandatory", exceptions.ErrorFieldIsMandatory)
		return
	}
	p.UserId = r.Context().Value("userId").(string)
	p.PostId = chi.URLParam(r, "id")

	_, err := c.storage.Create(&p)

	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	render.JSON(w, r, p)
}

func (c *PostCommentController) ListByPostId(w http.ResponseWriter, r *http.Request) {
	limit := 50
	offset := 0
	limitFromRequest := r.URL.Query().Get("limit")
	offsetFromRequest := r.URL.Query().Get("offset")

	if limitFromRequest != "" {
		limit, _ = strconv.Atoi(limitFromRequest)
	}

	if offsetFromRequest != "" {
		offset, _ = strconv.Atoi(offsetFromRequest)
	}
	var comments *[]dataType.PostComment
	var err error

	comments = c.storage.ByPostId(chi.URLParam(r, "id"), limit, offset)

	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}
	functions.RenderJSON(w, r, *comments)
}
