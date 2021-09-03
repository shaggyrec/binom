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
	tariffPriceStorage *storage.TariffPriceStorage
}

func (c *TariffController) Init(storage *storage.TariffStorage, tariffPriceStorage *storage.TariffPriceStorage) {
	c.storage = storage
	c.tariffPriceStorage = tariffPriceStorage
}

func (c *TariffController) List(w http.ResponseWriter, r *http.Request) {
	userRole := r.Context().Value("userRole").(int)
	statuses := []int{dataType.StatusLive}
	if userRole == dataType.UserRoleAdmin {
		statuses = append(statuses, dataType.StatusDraft)
	}
	list, err := c.storage.List(statuses)
	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}
	functions.RenderJSON(w, r, *list)
}

func (c *TariffController) Create(w http.ResponseWriter, r *http.Request)  {
	var tariff dataType.Tariff
	if err := functions.ParseRequest(w, r, &tariff);  err != nil {
		return
	}

	if tariff.Name == "" {
		exceptions.BadRequestError(w, r, "`name` is mandatory", exceptions.ErrorFieldIsMandatory)
		return
	}

	_, err := c.storage.Create(&tariff)

	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	render.JSON(w, r, tariff)
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

func (c *TariffController) CreatePrice(w http.ResponseWriter, r *http.Request) {
	var price dataType.TariffPrice
	if err := functions.ParseRequest(w, r, &price);  err != nil {
		return
	}

	if price.Price == 0 || price.Duration == 0 {
		exceptions.BadRequestError(w, r, "`price` and `duration` are mandatory", exceptions.ErrorFieldIsMandatory)
		return
	}

	tariffId, err := strconv.Atoi(chi.URLParam(r, "tariffId"))

	price.TariffId = tariffId

	newPrice, err := c.tariffPriceStorage.Create(&price)

	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	render.JSON(w, r, newPrice)
}

func (c *TariffController) UpdatePrice(w http.ResponseWriter, r *http.Request) {
	var price map[string]interface{}
	if err := functions.ParseRequest(w, r, &price);  err != nil {
		return
	}

	// TODO check access

	err := c.tariffPriceStorage.Update(chi.URLParam(r, "id"), price)

	if err != nil {
		log.Print(err)
		exceptions.BadRequestError(w, r, err.Error(), exceptions.NothingAffected)
		return
	}

	render.JSON(w, r, "ok")
}

func (c *TariffController) DeletePrice(w http.ResponseWriter, r *http.Request) {
	err := c.tariffPriceStorage.Delete(chi.URLParam(r, "id"))

	if err != nil {
		exceptions.BadRequestError(w, r, err.Error(), exceptions.NothingAffected)
		return
	}

	render.JSON(w, r, "ok")
}

func (c *TariffController) Subscribe(w http.ResponseWriter, r *http.Request) {

}
