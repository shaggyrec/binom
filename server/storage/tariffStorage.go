package storage

import (
	"binom/server/dataType"
	"binom/server/functions"
	"errors"
	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"
	"github.com/mitchellh/mapstructure"
)

type TariffStorage struct {
	db *pg.DB
}

func (s *TariffStorage) Init (db *pg.DB)  {
	s.db = db
}

func (s *TariffStorage) Create(subscription *dataType.Tariff) (*dataType.Tariff, error) {
	_, err := s.db.Model(subscription).Insert()

	return subscription, err
}

func (s *TariffStorage) Update(id int, tariffMap map[string]interface{}) error {
	if _, ok := tariffMap["prices"]; ok {
		delete(tariffMap, "prices")
	}

	r, err := s.db.Model(s.mapDbRow(tariffMap)).
		Column(functions.MapKeys(tariffMap)...).
		Where("id = ?", id).
		Update()

	if r == nil || r.RowsAffected() == 0 {
		return errors.New("nothing updated")
	}
	return err
}

func (s *TariffStorage) Delete(id int) error {
	r, err := s.db.Model(&dataType.Tariff{Id: id}).WherePK().Delete()
	if err != nil {
		return err
	}
	if r.RowsAffected() == 0 {
		return errors.New("nothing deleted")
	}
	return nil
}

func (s *TariffStorage) List() (*[]dataType.Tariff, error) {
	var tariffs []dataType.Tariff

	err := s.db.Model(&tariffs).
		Relation("Prices", func(q *orm.Query) (*orm.Query, error) {
		return q.Order("price ASC", "created ASC"), nil
	}).
		Where("status < ?", dataType.StatusDeleted).
		Order("created ASC").
		Select()

	return &tariffs, err
}

func (s *TariffStorage) ById(id int) (*dataType.Tariff, error)  {
	subscription := dataType.Tariff{Id: id}

	err := s.db.Model(&subscription).WherePK().Select()

	return &subscription, err
}

func (s *TariffStorage) mapDbRow(data map[string]interface{}) *dataType.Tariff {
	var tariff dataType.Tariff
	mapstructure.Decode(data, &tariff)
	if val, ok := data["status"]; ok {
		tariff.Status.Int64 = statusToInt(val)
		tariff.Status.Valid = true
	}
	return &tariff
}
