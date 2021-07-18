package functions

import (
	"crypto/md5"
	"encoding/hex"
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

func MD5(text string) string {
	algorithm := md5.New()
	algorithm.Write([]byte(text))
	return hex.EncodeToString(algorithm.Sum(nil))
}

func IndexOf(slice []string, item string) int {
	for i := range slice {
		if slice[i] == item {
			return i
		}
	}
	return -1
}