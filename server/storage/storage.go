package storage

import (
	"github.com/go-pg/pg"
	"reflect"
)

type Storage interface {
	Init()
	Create() interface{}
	Update()
	Delete()
	Get() interface{}
}

type Factory struct {
}

func (f *Factory) AuthCode(db *pg.DB) *AuthCodeStorage {
	storage := AuthCodeStorage{}
	storage.Init(db)
	return &storage
}

func (f *Factory) User(db *pg.DB) *UserStorage {
	storage := UserStorage{}
	storage.Init(db)
	return &storage
}

func (f *Factory) Token(db *pg.DB) *TokenStorage {
	storage := TokenStorage{}
	storage.Init(db)
	return &storage
}

func (f *Factory) Topic(db *pg.DB) *TopicStorage {
	storage := TopicStorage{}
	storage.Init(db)
	return &storage
}

func (f *Factory) Lesson(db *pg.DB) *LessonStorage {
	storage := LessonStorage{}
	storage.Init(db)
	return &storage
}

func (f *Factory) File(db *pg.DB) *FileStorage {
	storage := FileStorage{}
	storage.Init(db)
	return &storage
}

func (f *Factory) LessonComment(db *pg.DB) *LessonCommentStorage {
	storage := LessonCommentStorage{}
	storage.Init(db)
	return &storage
}

func (f *Factory) Notification(db *pg.DB) *NotificationStorage {
	storage := NotificationStorage{}
	storage.Init(db)
	return &storage
}

func (f *Factory) Tariff(db *pg.DB) *TariffStorage {
	storage := TariffStorage{}
	storage.Init(db)
	return &storage
}

func (f *Factory) TariffPrice(db *pg.DB) *TariffPriceStorage {
	storage := TariffPriceStorage{}
	storage.Init(db)
	return &storage
}

func (f *Factory) UserSubscription(db *pg.DB) *UserSubscriptionStorage {
	storage := UserSubscriptionStorage{}
	storage.Init(db)
	return &storage
}

func (f *Factory) Transaction(db *pg.DB) *TransactionStorage {
	storage := TransactionStorage{}
	storage.Init(db)
	return &storage
}

func (f *Factory) PointsMovement(db *pg.DB) *PointsMovementStorage {
	storage := PointsMovementStorage{}
	storage.Init(db)
	return &storage
}

func (f *Factory) Post(db *pg.DB) *PostStorage {
	storage := PostStorage{}
	storage.Init(db)
	return &storage
}

func statusToInt(status interface{}) int64 {
	if reflect.TypeOf(status).Name() == "int" {
		return int64(status.(int))
	} else {
		return int64(status.(float64))
	}
}