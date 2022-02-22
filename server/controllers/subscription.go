package controllers

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/service"
	"binom/server/storage"
	"fmt"
	"gopkg.in/guregu/null.v4"
	"net/http"
)

type SubscriptionController struct {
	userSubscriptionStorage *storage.UserSubscriptionStorage
	topicsStorage           *storage.TopicStorage
	yooMoneyService         *service.YoomoneyService
}

func (c *SubscriptionController) Init(userSubscriptionStorage *storage.UserSubscriptionStorage, topicsStorage *storage.TopicStorage, yooMoneyService *service.YoomoneyService) {
	c.userSubscriptionStorage = userSubscriptionStorage
	c.topicsStorage = topicsStorage
	c.yooMoneyService = yooMoneyService
}

func (c *SubscriptionController) Buy(w http.ResponseWriter, r *http.Request) {
	var topicsIds []string

	userId := r.Context().Value("userId").(string)
	err := functions.ParseRequest(w, r, &topicsIds)

	if err != nil {
		exceptions.BadRequestError(w, r, "topicsIds must be array id uuids", exceptions.ErrorBadParam)
		return
	}

	topics, err := c.topicsStorage.ListByIds(topicsIds)

	if len(topicsIds) != len(*topics) {
		exceptions.BadRequestError(w, r, "You sent non-existent topics", exceptions.ErrorBadParam)
		return
	}

	total := 0
	for _, topic := range *topics {
		total += topic.Price
	}

	subscription, err := c.userSubscriptionStorage.ByTopics(userId, topicsIds, dataType.StatusDraft)

	if err != nil || subscription.PaidPrice != total {
		subscription, err = c.userSubscriptionStorage.Create(
			&dataType.UserSubscription{
				UserId:    userId,
				Name:      fmt.Sprintf("Доступ к блокам. Количество - %d", len(topicsIds)),
				PaidPrice: total,
				Topics:    topicsIds,
				Status:    null.IntFrom(dataType.StatusDraft),
			},
		)
	}

	if err != nil {
		fmt.Println(err)
		exceptions.ServerError(w, r)
		return
	}

	functions.RenderJSON(w, r, c.yooMoneyService.GetPaymentParams(subscription))
}

func (c *SubscriptionController) ListOfActive(w http.ResponseWriter, r *http.Request) {
	functions.RenderJSON(w, r, c.userSubscriptionStorage.ByUserId(r.Context().Value("userId").(string), []int{dataType.StatusLive}))
}
