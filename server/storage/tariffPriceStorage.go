package storage

import (
	"binom/server/dataType"
	"binom/server/functions"
	"errors"
	"github.com/go-pg/pg"
	"github.com/mitchellh/mapstructure"
)

type TariffPriceStorage struct {
	db *pg.DB
}

func (s *TariffPriceStorage) Init (db *pg.DB)  {
	s.db = db
}

func (s *TariffPriceStorage) Create(tariffPrice *dataType.TariffPrice) (*dataType.TariffPrice, error) {
	_, err := s.db.Model(tariffPrice).Insert()

	return tariffPrice, err
}

func (s *TariffPriceStorage) Update(id string, tariffPriceMap map[string]interface{}) error {
	r, err := s.db.Model(s.mapDbRow(tariffPriceMap)).
		Column(functions.MapKeys(tariffPriceMap)...).
		Where("id = ?", id).
		Update()

	if r == nil || r.RowsAffected() == 0 {
		return errors.New("nothing updated")
	}
	return err
}

func (s *TariffPriceStorage) Delete(id string) error {
	r, err := s.db.Model(&dataType.TariffPrice{Id: id}).WherePK().Delete()
	if err != nil {
		return err
	}
	if r.RowsAffected() == 0 {
		return errors.New("nothing deleted")
	}
	return nil
}


func (s *TariffPriceStorage) mapDbRow(data map[string]interface{}) *dataType.TariffPrice  {
	var price dataType.TariffPrice
	mapstructure.Decode(data, &price)

	return &price
}