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
	"log"
	"net/http"
	"strconv"
)

type TopicController struct {
	topicStorage *storage.TopicStorage
	moveAtPositionService *service.MoveAtPositionService
}

func (c *TopicController) Init(topicStorage *storage.TopicStorage, moveAtPositionService *service.MoveAtPositionService) {
	c.topicStorage = topicStorage
	c.moveAtPositionService = moveAtPositionService
}

func (c *TopicController) Create(w http.ResponseWriter, r *http.Request) {
	var t dataType.Topic
	if err := functions.ParseRequest(w, r, &t);  err != nil {
		return
	}

	if t.Name.String == "" || t.Alias.String == "" {
		exceptions.BadRequestError(w, r, "`name` and `alias` are mandatory", exceptions.ErrorFieldIsMandatory)
		return
	}

	_, err := c.topicStorage.Create(&t)

	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	render.JSON(w, r, t)
}

func (c *TopicController) Update(w http.ResponseWriter, r *http.Request) {
	var topicToUpdate map[string]interface{}
	if err := functions.ParseRequest(w, r, &topicToUpdate);  err != nil {
		return
	}

	err := c.topicStorage.Update(chi.URLParam(r, "id"), topicToUpdate)

	if err != nil {
		log.Print(err)
		pgErr, ok := err.(pg.Error)
		if ok && pgErr.IntegrityViolation() {
			exceptions.BadRequestError(w, r, "Topic with alias \"" + topicToUpdate["alias"].(string) + "\" already exists", exceptions.AlreadyExists)
		} else {
			exceptions.BadRequestError(w, r, err.Error(), exceptions.NothingAffected)
		}
		return
	}

	render.JSON(w, r, "ok")
}

func (c * TopicController) Delete(w http.ResponseWriter, r *http.Request) {
	err := c.topicStorage.Delete(chi.URLParam(r, "id"))
	if err != nil {
		exceptions.BadRequestError(w, r, err.Error(), exceptions.NothingAffected)
	}
	render.JSON(w, r, "ok")
}

func (c *TopicController) List(w http.ResponseWriter, r *http.Request) {
	limit := 50
	offset := 0
	withLessons := false
	limitFromRequest := r.URL.Query().Get("limit")
	offsetFromRequest := r.URL.Query().Get("offset")
	withLessonsFromRequest := r.URL.Query().Get("withLessons")
	userId := r.Context().Value("userId").(string)
	userRole := r.Context().Value("userRole").(int)

	if limitFromRequest != "" {
		limit, _ = strconv.Atoi(limitFromRequest)
	}

	if offsetFromRequest != "" {
		offset, _ = strconv.Atoi(offsetFromRequest)
	}

	if withLessonsFromRequest != "" {
		withLessons, _ = strconv.ParseBool(withLessonsFromRequest)
	}

	userIdForListRequest := ""

	if userRole != dataType.UserRoleAdmin {
		userIdForListRequest = userId
	}

	topics, err := c.topicStorage.List(limit, offset, withLessons, userIdForListRequest)
	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	functions.RenderJSON(w, r, *topics)
}

func (c *TopicController) ByAlias(w http.ResponseWriter, r *http.Request)  {
	alias := chi.URLParam(r, "alias")

	t, err := c.topicStorage.GetByAlias(alias)

	if err != nil {
		exceptions.NotFoundError(w, r, "Topic not found")
	}

	render.JSON(w, r, t)
}

func (c *TopicController) MoveAtPosition(w http.ResponseWriter, r *http.Request)  {
	id := chi.URLParam(r, "id")
	posFromRequest := chi.URLParam(r, "pos")

	pos, err := strconv.Atoi(posFromRequest)

	if err != nil {
		exceptions.BadRequestError(w, r, "Bad param \"pos\"", exceptions.ErrorBadParam)
		return
	}

	err = c.moveAtPositionService.Move("topics", id, pos, "", "")

	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	render.Status(r, http.StatusOK)
}
