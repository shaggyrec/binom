package storage

import (
	"binom/server/dataType"
	"github.com/go-pg/pg"
)

type PointsMovementStorage struct {
	db *pg.DB
}

func (s *PointsMovementStorage) Init(db *pg.DB)  {
	s.db = db
}

func (s *PointsMovementStorage) Store(userId string, amount int, description string) (*dataType.PointsMovement, error) {
	pointsMovement := dataType.PointsMovement{UserId: userId, Amount: amount, Description: description}
	_, err := s.db.Model(&pointsMovement).Insert()

	return &pointsMovement, err
}

func (s *PointsMovementStorage) ByUserId(userId string) *[]dataType.PointsMovement {
	var pointsMovements []dataType.PointsMovement

	s.db.Model(&pointsMovements).Where("user_id = ?", userId).Select()

	return &pointsMovements
}
