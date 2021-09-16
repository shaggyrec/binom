package storage

import (
	"binom/server/dataType"
	"binom/server/functions"
	"errors"
	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"
	"github.com/mitchellh/mapstructure"
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

func (u *UserStorage) Update(id string, userDataToUpdate map[string]interface{}) error {
	r, err := u.db.Model(u.mapDbRow(userDataToUpdate)).
		Column(functions.ArrayToSnakeCase(functions.MapKeys(userDataToUpdate))...).
		Where("id = ?", id).
		Update()

	if r != nil && r.RowsAffected() == 0 {
		err = errors.New("nothing affected")
	}

	return err
}

func (u *UserStorage) Delete() {

}

func (u *UserStorage) Get(id string) (*dataType.User, error) {
	user := &dataType.User{ Id: id }
	err := u.db.Model(user).
		Relation("Subscription", func(q *orm.Query) (*orm.Query, error) {
				return q.JoinOn("status = ? AND expired > NOW()", dataType.StatusLive).Order("expired DESC"), nil
		}).
		WherePK().
		Select()

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
	err := u.db.Model(user).
		Relation("Subscription", func(q *orm.Query) (*orm.Query, error) {
			return q.JoinOn("status = ? AND expired > NOW()", dataType.StatusLive).Order("expired DESC"), nil
		}).
		Where("username = ?", username).Select()
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

func (u *UserStorage) GetUsersByIds(ids []string) []dataType.User {
	var users []dataType.User
	u.db.Model(&users).Where("id IN (?)", pg.In(ids)).Select()

	return users
}

func (u *UserStorage) mapDbRow(data map[string]interface{}) *dataType.User {
	var user dataType.User
	mapstructure.Decode(data, &user)

	if val, ok := data["name"]; ok {
		user.Name.String = val.(string)
		user.Name.Valid = true
	}

	if val, ok := data["username"]; ok {
		user.Username.String = val.(string)
		user.Username.Valid = true
	}
	return &user
}