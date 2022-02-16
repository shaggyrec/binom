package controllers

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/storage"
	"fmt"
	"net/http"
)

type QuestionnaireController struct {
	storage *storage.QuestionnaireStorage
}

func (c *QuestionnaireController) Init(storage *storage.QuestionnaireStorage) {
	c.storage = storage
}

func (c *QuestionnaireController) Submit(w http.ResponseWriter, r *http.Request) {

	var answers []dataType.Answer
	if err := functions.ParseRequest(w, r, &answers); err != nil {
		fmt.Println(err)
		return
	}

	userId := r.Context().Value("userId").(string)

	for _, answer := range answers {
		answer.UserId = userId
		err := c.storage.StoreAnswer(&answer)
		if err != nil {
			fmt.Println(err)
			exceptions.ServerError(w, r)
			return
		}
	}

	functions.RenderJSON(w, r, "Ok")
}
