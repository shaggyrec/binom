package functions

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"math/rand"
	"path"
	"regexp"
	"strings"
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

func MapKeys(m map[string]interface{}) []string {
	keys := make([]string, 0, len(m))

	for k := range m {
		keys = append(keys, k)
	}

	return keys
}

var matchFirstCap = regexp.MustCompile("(.)([A-Z][a-z]+)")
var matchAllCap   = regexp.MustCompile("([a-z0-9])([A-Z])")

func ToSnakeCase(str string) string {
	snake := matchFirstCap.ReplaceAllString(str, "${1}_${2}")
	snake  = matchAllCap.ReplaceAllString(snake, "${1}_${2}")
	return strings.ToLower(snake)
}

func ArrayToSnakeCase(arr []string) []string {
	var result []string
	for _, element := range arr {
		result = append(result, ToSnakeCase(element))
	}
	return result
}

func InterfaceToMap(v interface{}) map[string]interface{} {
	b, _ := json.Marshal(v)

	var f interface{}
	json.Unmarshal(b, &f)

	myMap := f.(map[string]interface{})

	return myMap
}
