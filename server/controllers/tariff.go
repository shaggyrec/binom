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

type TariffController struct {
	storage *storage.TariffStorage
}

func (c *TariffController) Init(storage *storage.TariffStorage) {
	c.storage = storage
}

func (c *TariffController) List(w http.ResponseWriter, r *http.Request) {
	list, err := c.storage.List()
	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}
	functions.RenderJSON(w, r, *list)
}

func (c *TariffController) Create(w http.ResponseWriter, r *http.Request)  {
	var subscription dataType.Tariff
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

func (c *TariffController) Update(w http.ResponseWriter, r *http.Request)  {
	var tariff map[string]interface{}
	if err := functions.ParseRequest(w, r, &tariff);  err != nil {
		return
	}

	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}
	// TODO check access

	err = c.storage.Update(id, tariff)

	if err != nil {
		log.Print(err)
		exceptions.BadRequestError(w, r, err.Error(), exceptions.NothingAffected)
		return
	}

	render.JSON(w, r, "ok")
}

func (c *TariffController) Delete(w http.ResponseWriter, r *http.Request)  {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}
	err = c.storage.Update(id, map[string]interface{}{"status": dataType.StatusDeleted})

	if err != nil {
		log.Print(err)
		exceptions.BadRequestError(w, r, err.Error(), exceptions.NothingAffected)
		return
	}

	render.JSON(w, r, "ok")
}

func (c *TariffController) Subscribe(w http.ResponseWriter, r *http.Request) {

}


