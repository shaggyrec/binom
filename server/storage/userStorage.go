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
	_, err := u.db.Model(user).WherePK().Update()

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

func (u *UserStorage) GetByUsername(username string) (*dataType.User, error)  {
	user := &dataType.User{}
	err := u.db.Model(user).Where("username = ?", username).Select()
	if err != nil {
		return user, err
	}
	return user, nil
}

func (u *UserStorage) List(where string) (*[]dataType.User, error) {
	users := &[]dataType.User{}
	dbQuery := u.db.Model(users)
	if where != "" {
		dbQuery.Where(where)
	}
	err := dbQuery.Select()

	return users, err
}

func (u *UserStorage) GetAdminsIds() ([]string, error) {
	var usersIds []string
	_, err := u.db.Query(&usersIds, "SELECT id FROM users WHERE role = ?", dataType.UserRoleAdmin)

	return usersIds, err
}