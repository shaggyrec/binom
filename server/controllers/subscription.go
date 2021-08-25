package controllers

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/storage"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"log"
	"net/http"
	"strconv"
)

type SubscriptionController struct {
	storage *storage.SubscriptionStorage
}

func (c *SubscriptionController) Init(storage *storage.SubscriptionStorage) {
	c.storage = storage
}

func (c *SubscriptionController) List(w http.ResponseWriter, r *http.Request) {
	list, err := c.storage.List()
	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}
	functions.RenderJSON(w, r, *list)
}

func (c *SubscriptionController) Create(w http.ResponseWriter, r *http.Request)  {
	var subscription dataType.Subscription
	if err := functions.ParseRequest(w, r, &subscription);  err != nil {
		return
	}

	if subscription.Name == "" {
		exceptions.BadRequestError(w, r, "`name` is mandatory", exceptions.ErrorFieldIsMandatory)
		return
	}

	_, err := c.storage.Create(&subscription)

	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	render.JSON(w, r, subscription)
}

func (c *SubscriptionController) Update(w http.ResponseWriter, r *http.Request)  {
	var subscription map[string]interface{}
	if err := functions.ParseRequest(w, r, &subscription);  err != nil {
		return
	}

	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}
	// TODO check access

	fmt.Println(subscription)
	err = c.storage.Update(id, subscription)

	if err != nil {
		log.Print(err)
		exceptions.BadRequestError(w, r, err.Error(), exceptions.NothingAffected)
		return
	}

	render.JSON(w, r, "ok")
}

func (c *SubscriptionController) Delete(w http.ResponseWriter, r *http.Request)  {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}
	err = c.storage.Delete(id)

	if err != nil {
		log.Print(err)
		exceptions.BadRequestError(w, r, err.Error(), exceptions.NothingAffected)
		return
	}

	render.JSON(w, r, "ok")
}

func (c *SubscriptionController) Subscribe(w http.ResponseWriter, r *http.Request) {

}


