package storage

import (
	"binom/server/dataType"
	"errors"
	"github.com/go-pg/pg"
	"github.com/go-pg/pg/types"
	"gopkg.in/guregu/null.v4"
	"strings"
)

type UserSubscriptionDb struct {
	Id            string       `json:"id"`
	UserId        string       `json:"userId"`
	Name          string       `json:"name"`
	PaidPrice     int          `json:"paidPrice"`
	Created       pg.NullTime  `json:"created"`
	Status        null.Int     `json:"status"`
	Topics        *types.Array `sql:",array" json:"topics"`
	TransactionId string       `json:"transactionId"`
}

type UserSubscriptionStorage struct {
	db *pg.DB
}

func (u *UserSubscriptionStorage) Init(db *pg.DB) {
	u.db = db
}

func (u *UserSubscriptionStorage) Create(s *dataType.UserSubscription) (*dataType.UserSubscription, error) {
	_, err := u.db.Model(s).Insert()
	//var topicsIds []string
	//for _, t := range s.Topics {
	//	topicsIds = append(topicsIds, "\""+t+"\"")
	//}
	//
	//_, err := u.db.QueryOne(
	//	s,
	//	"INSERT INTO user_subscriptions (user_id, status, paid_price, topics) VALUES (?, ?, ?, '["+strings.Join(topicsIds, ", ")+"]')",
	//	s.UserId, s.Status, s.PaidPrice,
	//)
	return s, err
}

func (u *UserSubscriptionStorage) ByTariffPrice(tariffId int, price int, userId string, status []int) (*dataType.UserSubscription, error) {
	var s dataType.UserSubscription
	err := u.db.Model(&s).Where(
		"tariff_id = ? AND paid_price = ? AND user_id = ? AND status IN (?)",
		tariffId,
		price,
		userId,
		pg.In(status),
	).Select()

	if err != nil {
		return nil, err
	}

	return &s, nil
}

func (u *UserSubscriptionStorage) Update(s *dataType.UserSubscription) (*dataType.UserSubscription, error) {
	r, err := u.db.Model(s).WherePK().Update()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}
	return s, err
}

func (u *UserSubscriptionStorage) ById(id string) (*dataType.UserSubscription, error) {
	s := dataType.UserSubscription{Id: id}
	err := u.db.Model(&s).WherePK().Select()

	if err != nil {
		return nil, err
	}

	return &s, nil
}

func (u *UserSubscriptionStorage) ByUserId(userId string, status []int) *[]dataType.UserSubscription {
	var s []dataType.UserSubscription

	u.db.Model(&s).Where("user_id = ? AND status IN (?)", userId, pg.In(status)).Select()

	return &s
}

func (u *UserSubscriptionStorage) LastByUserId(userId string) *dataType.UserSubscription {
	var s dataType.UserSubscription

	u.db.Model(&s).
		Where("user_id = ? AND status IN (?)", userId, pg.In([]int{1, 2})).
		Order("expired DESC").
		Select()

	return &s
}

func (u *UserSubscriptionStorage) ByTopics(userId string, topics []string, status int) (*dataType.UserSubscription, error) {
	var s dataType.UserSubscription

	var topicsToSearch []string

	for _, topic := range topics {
		topicsToSearch = append(topicsToSearch, "\""+topic+"\"")
	}

	err := u.db.Model(&s).Where(
		"topics::text = ? AND status = ? AND user_id = ?",
		"["+strings.Join(topicsToSearch, ", ")+"]",
		status,
		userId,
	).Select()

	return &s, err
}
