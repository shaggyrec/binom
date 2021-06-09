package dataType

import (
	"database/sql"
	"encoding/json"
	"reflect"
)

type NullString sql.NullString

func (ns *NullString) Scan(value interface{}) error {
	var s sql.NullString
	if err := s.Scan(value); err != nil {
		return err
	}
	if reflect.TypeOf(value) == nil {
		*ns = NullString{String: s.String}
	} else {
		*ns = NullString{String: s.String, Valid: true}
	}

	return nil
}

func (ns *NullString) MarshalJSON() ([]byte, error) {
	if !ns.Valid {
		return []byte("null"), nil
	}
	return json.Marshal(ns.String)
}

// UnmarshalJSON for NullString
func (ns *NullString) UnmarshalJSON(b []byte) error {
	err := json.Unmarshal(b, &ns.String)
	ns.Valid = (err == nil)
	return err
}

type NullInt sql.NullInt64

func (ni *NullInt) Scan(value interface{}) error {
	var i sql.NullInt64
	if err := i.Scan(value); err != nil {
		return err
	}
	if reflect.TypeOf(value) == nil {
		*ni = NullInt{Int64: i.Int64}
	} else {
		*ni = NullInt{Int64: i.Int64, Valid: true}
	}

	return nil
}

func (ni *NullInt) MarshalJSON() ([]byte, error) {
	if !ni.Valid {
		return []byte("null"), nil
	}
	return json.Marshal(ni.Int64)
}

func (ni *NullInt) UnmarshalJSON(b []byte) error {
	err := json.Unmarshal(b, &ni.Int64)
	ni.Valid = (err == nil)
	return err
}