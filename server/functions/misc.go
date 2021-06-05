package functions

import (
	"math/rand"
	"path"
	"time"
)

func RandomInt (from int, to int) int {
	rand.Seed(time.Now().UnixNano())
	return rand.Intn(to - from) + from
}

func CurrPath(pc uintptr, file string, line int, ok bool) string {
	return path.Join(path.Dir(file))
}
