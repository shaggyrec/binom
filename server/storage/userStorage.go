package storage

import (
	"binom/server/dataType"
	"github.com/go-pg/pg"
)

type UserStorage struct {
	db *pg.DB
}

func (u *UserStorage) Init(db *pg.DB) {
	u.db = db
}

func (u *UserStorage) Create(user *dataType.User) (*dataType.User, error) {
	_, err := u.db.Model(user).Insert()

	return user, err
}

func (u *UserStorage) Update(user *dataType.User) (*dataType.User, error) {
	_, err := u.db.Model(user).Update()

	return user, err
}

func (u *UserStorage) Delete() {

}

func (u *UserStorage) Get(id string) (*dataType.User, error) {
	user := &dataType.User{ Id: id }
	err := u.db.Model(user).WherePK().Select()
	return user, err
}

func (u *UserStorage) GetByEmail(email string) (*dataType.User, error) {
	user := &dataType.User{}
	err := u.db.Model(user).Where("email = ?", email).Select()
	if err != nil {
		return user, err
	}
	return user, nil
}