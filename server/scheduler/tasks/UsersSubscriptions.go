package tasks

import (
	"binom/server/dataType"
	"binom/server/service"
	"binom/server/storage"
	"fmt"
	"github.com/go-pg/pg"
	"gopkg.in/guregu/null.v4"
	"log"
)

func UsersSubscriptions(db *pg.DB, notificationService *service.NotificationService, userSubscriptionStorage *storage.UserSubscriptionStorage) func() {
	return func() {
		var subscriptions []struct{Id string; UserId string; DateDiff int}

		r, err := db.Query(
			&subscriptions,
			`SELECT id, user_id, expired::DATE - NOW()::DATE as date_diff
       					FROM user_subscriptions
					WHERE status = ? AND expired::DATE - 2 < NOW()::DATE`,
       		dataType.StatusLive,
		)

		if err != nil {
			log.Println(err)
			return
		}

		if r.RowsReturned() == 0 {
			return
		}

		for _, subscription := range subscriptions {
			m := "Подписка binom.school закончилась. У тебя есть только семь дней, чтобы продлить ее по старой цене"
			if subscription.DateDiff < 0 && subscription.DateDiff > -6   {
				return
			}
			if subscription.DateDiff < -5  {
				m = "Подписка binom.school закончилась. Последний шанс продлить её по старой цене"
			}
			if subscription.DateDiff < -7  {
				s, _ := userSubscriptionStorage.ById(subscription.Id)
				s.Status = null.IntFrom(dataType.StatusDeleted)
				_, err = userSubscriptionStorage.Update(s)
				if err != nil {
					log.Println(err)
				}
				return
			}
			status := null.IntFrom(dataType.NotificationSubscriptionIsExpired)
			if subscription.DateDiff > 0 {
				m = fmt.Sprintf("Подписка binom.school заканчивается. Осталось дней - %d", subscription.DateDiff)
				status = null.IntFrom(dataType.NotificationSubscriptionIsExpiring)
			}
			m += "\nКупи новую. Егэ сам себя не сдаст"
			err = notificationService.Create(&dataType.Notification{
				Message: m,
				Type: status,
				Meta: dataType.NotificationMeta{Link: "/buy"},
			}, []string{subscription.UserId})
			if err != nil {
				log.Println(err)
			}
		}
	}
}


