package controllers

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/service"
	"binom/server/storage"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/go-pg/pg"
	"github.com/google/uuid"
	"gopkg.in/guregu/null.v4"
	"log"
	"net/http"
	"strconv"
)

type LessonController struct {
	lessonStorage *storage.LessonStorage
	moveAtPositionService *service.MoveAtPositionService
}

func (c *LessonController) Init(lessonStorage *storage.LessonStorage, moveAtPositionService *service.MoveAtPositionService) {
	c.lessonStorage = lessonStorage
	c.moveAtPositionService = moveAtPositionService
}

func (c *LessonController) Create(w http.ResponseWriter, r *http.Request) {
	var l dataType.Lesson
	if err := functions.ParseRequest(w, r, &l);  err != nil {
		return
	}

	if l.Name.String == "" || l.Alias.String == "" {
		exceptions.BadRequestError(w, r, "`name` and `alias` are mandatory", exceptions.ErrorFieldIsMandatory)
		return
	}

	if !l.Pos.Valid {
		l.Pos = null.IntFrom(99)
	}

	_, err := c.lessonStorage.Create(&l)

	if err != nil {
		log.Print(err)
		pgErr, ok := err.(pg.Error)
		if ok && pgErr.IntegrityViolation() {
			exceptions.BadRequestError(w, r, "Lessson with alias \"" + l.Alias.String + "\" already exists", exceptions.AlreadyExists)
		} else {
			exceptions.ServerError(w, r)
		}
		return
	}

	render.JSON(w, r, l)
}

func (c *LessonController) Update(w http.ResponseWriter, r *http.Request) {
	var lessonToUpdate map[string]interface{}
	if err := functions.ParseRequest(w, r, &lessonToUpdate);  err != nil {
		return
	}

	err := c.lessonStorage.Update(chi.URLParam(r, "id"), lessonToUpdate)

	if err != nil {
		log.Print(err)
		pgErr, ok := err.(pg.Error)
		if ok && pgErr.IntegrityViolation() {
			exceptions.BadRequestError(w, r, err.Error(), exceptions.AlreadyExists)
		} else {
			exceptions.BadRequestError(w, r, err.Error(), exceptions.NothingAffected)
		}
		return
	}

	render.JSON(w, r, "ok")
}

func (c * LessonController) Delete(w http.ResponseWriter, r *http.Request) {
	err := c.lessonStorage.Delete(chi.URLParam(r, "id"))
	if err != nil {
		exceptions.BadRequestError(w, r, err.Error(), exceptions.NothingAffected)
	}
	render.JSON(w, r, "ok")
}

func (c *LessonController) List(w http.ResponseWriter, r *http.Request) {
	limit := 50
	offset := 0
	limitFromRequest := r.URL.Query().Get("limit")
	offsetFromRequest := r.URL.Query().Get("offset")
	topic := chi.URLParam(r, "topic")

	if limitFromRequest != "" {
		limit, _ = strconv.Atoi(limitFromRequest)
	}

	if offsetFromRequest != "" {
		offset, _ = strconv.Atoi(offsetFromRequest)
	}
	var lessons *[]dataType.Lesson
	var err error
	if topic != "" {
		lessons, err = c.lessonStorage.ListByTopic(topic, limit, offset)
	} else {
		lessons, err = c.lessonStorage.List(limit, offset)
	}
	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}
	render.JSON(w, r, lessons)
}

func (c *LessonController) GetOneLesson(w http.ResponseWriter, r *http.Request) {
	alias := chi.URLParam(r, "alias")

	lessonId, err := uuid.Parse(alias)

	var l *dataType.Lesson

	if err != nil {
		l, err = c.lessonStorage.GetByAlias(alias)
	} else {
		l, err = c.lessonStorage.GetById(lessonId.String())
	}

	if err != nil {
		exceptions.NotFoundError(w, r, "Lesson not found")
		return
	}

	render.JSON(w, r, l)
}

func (c *LessonController) MoveAtPosition(w http.ResponseWriter, r *http.Request)  {
	id := chi.URLParam(r, "id")
	posFromRequest := chi.URLParam(r, "pos")

	pos, err := strconv.Atoi(posFromRequest)

	if err != nil {
		exceptions.BadRequestError(w, r, "Bad param \"pos\"", exceptions.ErrorBadParam)
		return
	}

	lesson, err := c.lessonStorage.GetById(id)

	if err != nil {
		exceptions.NotFoundError(w, r, "Lesson #" + id + " not found")
		return
	}

	err = c.moveAtPositionService.Move("lessons", id, pos, "topic_id", lesson.TopicId)

	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	render.Status(r, http.StatusOK)
}