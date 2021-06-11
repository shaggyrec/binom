package controllers

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/storage"
	"github.com/go-chi/render"
	"log"
	"net/http"
	"strconv"
)

type TopicController struct {
	topicStorage *storage.TopicStorage
}

func (c *TopicController) Init(topicStorage *storage.TopicStorage) {
	c.topicStorage = topicStorage
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
	var topicToUpdate dataType.Topic
	if err := functions.ParseRequest(w, r, &topicToUpdate);  err != nil {
		return
	}

	if topicToUpdate.Id == "" {
		exceptions.BadRequestError(w, r, "`id` is mandatory", exceptions.ErrorFieldIsMandatory)
		return
	}

	// TODO check access

	_, err := c.topicStorage.Update(&topicToUpdate)

	if err != nil {
		log.Print(err)
		exceptions.BadRequestError(w, r, err.Error(), exceptions.NothingAffected)
		return
	}

	render.JSON(w, r, "ok")
}

func (c *TopicController) List(w http.ResponseWriter, r *http.Request) {
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
	topics, err := c.topicStorage.List(limit, offset)
	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}
	render.JSON(w, r, topics)
}
