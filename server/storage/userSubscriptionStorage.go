package storage

import (
	"binom/server/dataType"
	"errors"
	"github.com/go-pg/pg"
)

type UserSubscriptionStorage struct {
	db *pg.DB
}

func (u *UserSubscriptionStorage) Init(db *pg.DB) {
	u.db = db
}

func (u *UserSubscriptionStorage) Create(s *dataType.UserSubscription) (*dataType.UserSubscription, error) {
	_, err := u.db.Model(s).Insert()
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

	u.db.Model(&s).Where("user_id = ? AND status IN (?) AND expired > NOW()", userId, pg.In(status)).Select()

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