package mailer

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"mime/multipart"
	"path/filepath"
)

func generateBoundary() string {
	buf := bytes.NewBuffer(nil)
	writer := multipart.NewWriter(buf)
	boundary := writer.Boundary()

	return boundary
}

func attachments(attachments []string, boundary string) string {
	if attachments == nil || len(attachments) == 0 {
		return ""
	}

	result := ""

	for _, attachmentSrc := range attachments {
		v, k, err := readFile(attachmentSrc)
		if err != nil {
			continue
		}

		result += fmt.Sprintf("\r\n--%s\r\n", boundary)
		result += "Content-Type: text/plain; charset=\"utf-8\"\r\n"
		result += "Content-Transfer-Encoding: base64\r\n"
		result += "Content-Disposition: attachment; filename=\"" + k + "\"\r\n"

		result += "\r\n" + base64.StdEncoding.EncodeToString(v)
		result += fmt.Sprintf("\r\n--%s", boundary) + "\r\n"
	}

	result += "--"

	return result
}

func readFile(src string) ([]byte, string, error) {
	b, err := ioutil.ReadFile(src)
	if err != nil {
		return nil, "", err
	}

	_, fileName := filepath.Split(src)

	return b, fileName, nil
}