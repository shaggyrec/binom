package dataType

import "gopkg.in/guregu/null.v4"

type UserNotification struct {
	Id string `json:"id"`
	NotificationId string `json:"-"`
	Notification *Notification `pg:"rel:has-one" json:"notification"`
	UserId string `json:"-"`
	Viewed null.Bool `json:"viewed"`
}

