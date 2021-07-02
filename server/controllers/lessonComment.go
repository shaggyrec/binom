package controllers

import (
	"binom/server/dataType"
	exceptions "binom/server/exceptions"
	"binom/server/functions"
	"binom/server/storage"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"log"
	"net/http"
)

type LessonCommentController struct {
	lessonCommentStorage *storage.LessonCommentStorage
}

func (c *LessonCommentController) Init(lessonCommentStorage *storage.LessonCommentStorage) {
	c.lessonCommentStorage = lessonCommentStorage
}

func (c *LessonCommentController) List(w http.ResponseWriter, r *http.Request) {
	lessonId := chi.URLParam(r, "lesson")
	userId := chi.URLParam(r, "user")
	comments, err := c.lessonCommentStorage.List(lessonId, userId)
	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}
	functions.RenderJSON(w, r, *comments)
}

func (c *LessonCommentController) Add(w http.ResponseWriter, r *http.Request)  {
	lessonId := chi.URLParam(r, "lesson")
	userId := chi.URLParam(r, "user")
	var comment dataType.LessonComment
	if err := functions.ParseRequest(w, r, &comment);  err != nil {
		return
	}

	comment.UserId = userId
	comment.LessonId = lessonId
	comment.Author = r.Context().Value("userId").(string)

	// TODO add checking access to adding comment by  r.Context().Value("userId").(string) == comment.Userid || isAdmin

	_, err := c.lessonCommentStorage.Create(&comment)

	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	if comment.Files != nil && len(comment.Files) > 0 {
		for _, file := range comment.Files {
			file.LessonCommentId = comment.Id
			_, err := c.lessonCommentStorage.AddFile(&file)
			if err != nil {
				log.Print(err)
				exceptions.ServerError(w, r)
				return
			}
		}
	}

	render.JSON(w, r, comment)
}

func (c *LessonCommentController) Delete(w http.ResponseWriter, r *http.Request)  {
	// commentId := chi.URLParam(r, "id")
}

func (c *LessonCommentController) Update(w http.ResponseWriter, r *http.Request)  {
	// commentId := chi.URLParam(r, "id")
}