package storage

import (
	"binom/server/dataType"
	"binom/server/functions"
	"errors"
	"github.com/go-pg/pg"
	"github.com/mitchellh/mapstructure"
)

type SubscriptionStorage struct {
	db *pg.DB
}

func (s *SubscriptionStorage) Init (db *pg.DB)  {
	s.db = db
}

func (s *SubscriptionStorage) Create(subscription *dataType.Subscription) (*dataType.Subscription, error) {
	_, err := s.db.Model(subscription).Insert()

	return subscription, err
}

func (s *SubscriptionStorage) Update(id int, subscriptionMap map[string]interface{}) error {

	r, err := s.db.Model(s.mapDbRow(subscriptionMap)).
		Column(functions.MapKeys(subscriptionMap)...).
		Where("id = ?", id).
		Update()

	if r == nil || r.RowsAffected() == 0 {
		return errors.New("nothing updated")
	}
	return err
}

func (s *SubscriptionStorage) Delete(id int) error {
	r, err := s.db.Model(&dataType.Subscription{Id: id}).WherePK().Delete()
	if err != nil {
		return err
	}
	if r.RowsAffected() == 0 {
		return errors.New("nothing deleted")
	}
	return nil
}

func (s *SubscriptionStorage) List() (*[]dataType.Subscription, error) {
	var subscriptions []dataType.Subscription

	err := s.db.Model(&subscriptions).Order("price ASC", "created ASC").Select()

	return &subscriptions, err
}

func (s *SubscriptionStorage) ById(id int) (*dataType.Subscription, error)  {
	subscription := dataType.Subscription{Id: id}

	err := s.db.Model(&subscription).WherePK().Select()

	return &subscription, err
}

func (s *SubscriptionStorage) mapDbRow(data map[string]interface{}) *dataType.Subscription {
	var subscription dataType.Subscription
	mapstructure.Decode(data, &subscription)
	if val, ok := data["status"]; ok {
		subscription.Status.Int64 = int64(val.(float64))
		subscription.Status.Valid = true
	}
	return &subscription
}