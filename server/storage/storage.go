package storage

import "github.com/go-pg/pg"

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