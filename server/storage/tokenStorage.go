package storage

import (
	"binom/server/dataType"
	"github.com/go-pg/pg"
)

type TokenStorage struct {
	db *pg.DB
}

func (t *TokenStorage) Init (db *pg.DB)  {
	t.db = db
}

func (t *TokenStorage) Create(tokenValue string, user string) (*dataType.Token, error) {
	token := &dataType.Token{Token: tokenValue, UserId: user}
	_, err := t.db.Model(token).Insert()

	return token, err
}

func (t *TokenStorage) Delete(id string) error {
	_, err := t.db.Model(&dataType.Token{ Id: id }).WherePK().Delete()
	return err
}

func (t *TokenStorage) Get(tokenValue string) (*dataType.Token, error) {
	token := &dataType.Token{ Token: tokenValue }
	err := t.db.Model(token).Where("token = ?", tokenValue).Select()

	return token, err
}