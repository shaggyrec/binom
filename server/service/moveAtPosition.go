package service

import (
	"fmt"
	"github.com/go-pg/pg"
)

type MoveAtPositionService struct {
	db *pg.DB
}

func (s *MoveAtPositionService) Init(db *pg.DB)  {
	s.db = db
}

func constraintCondition(prefix string, parentName string, parentId string) string {
	if parentName != "" {
		parentIdPart := "= '" + parentId + "'"
		if parentId == "" {
			parentIdPart = "IS NULL"
		}
		return fmt.Sprintf("WHERE %s.%s %s", prefix, parentName, parentIdPart)
	}
	return ""
}

func (s *MoveAtPositionService) Move(itemName string, itemId string, pos int, parentName string, parentId string) error {
	params := struct{Id string; Position int}{Id: itemId, Position: pos}
	_, err := s.db.Exec(
		fmt.Sprintf(
		`WITH positions AS (
                    SELECT item.id, ROW_NUMBER () OVER (ORDER BY item.pos) AS pos
                        FROM %s item
                    %s
                )
                UPDATE %s
                    SET pos = CASE
                        WHEN %s.id = ?id THEN ?position
                        WHEN (SELECT pos FROM positions p WHERE %s.id = p.id) >= ?position AND (SELECT pos FROM positions p WHERE %s.id = p.id) < (SELECT pos FROM positions p WHERE p.id = ?id)
                            THEN (SELECT pos FROM positions p WHERE %s.id = p.id) + 1
                        WHEN (SELECT pos FROM positions p WHERE %s.id = p.id) > (SELECT pos FROM positions p WHERE p.id = ?id) AND (SELECT pos FROM positions p WHERE %s.id = p.id) <= ?position
                            THEN (SELECT pos FROM positions p WHERE %s.id = p.id) - 1
                        ELSE (SELECT pos FROM positions p WHERE %s.id = p.id)
                    END
                %s`,
                itemName,
                constraintCondition("item", parentName, parentId),
				itemName, itemName, itemName, itemName, itemName, itemName, itemName, itemName, itemName,
				constraintCondition(itemName, parentName, parentId),
		),
		params,
	)

	return err
}
