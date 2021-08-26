package controllers

import (
	"binom/server/dataType"
	"binom/server/exceptions"
	"binom/server/storage"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"io/ioutil"
	"log"
	"mime"
	"net/http"
	"os"
	"path/filepath"
)

const maxUploadSize = 20 * 1024 * 1024 // 20 mb

type FileController struct {
	uploadPath string
	storage *storage.FileStorage
}

func (c *FileController) Init(uploadPath string, fileStorage *storage.FileStorage)  {
	c.uploadPath = uploadPath
	c.storage = fileStorage
}

func (c *FileController) Upload(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(maxUploadSize); err != nil {
		exceptions.BadRequestError(w, r, err.Error(), exceptions.CantParseFile)
		return
	}
	userId := r.Context().Value("userId").(string)
	file, fileHeader, err := r.FormFile("file")
	if err != nil {
		exceptions.BadRequestError(w, r, err.Error(), exceptions.CantParseFile)
		return
	}
	defer file.Close()

	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		exceptions.BadRequestError(w, r, err.Error(), exceptions.CantParseFile)
		return
	}
	detectedFileType := http.DetectContentType(fileBytes)

	ext, err := mime.ExtensionsByType(detectedFileType)

	if err != nil {
		exceptions.BadRequestError(w, r, "CANT_READ_FILE_TYPE", exceptions.CantParseFile)
		return
	}

	f := &dataType.File{
		Name: fileHeader.Filename,
		Type: detectedFileType,
		UserId: userId,
		Extension: ext[0],
	}

	f, err = c.storage.Create(f)

	if err != nil {
		exceptions.BadRequestError(w, r, err.Error(), exceptions.CantParseFile)
		return
	}

	pathToFile := filepath.Join(c.uploadPath, f.Id + f.Extension)
	createdFile, err := os.Create(pathToFile)
	if err != nil {
		c.storage.Delete(f.Id)
		exceptions.BadRequestError(w, r, err.Error(), exceptions.CantParseFile)
		return
	}
	defer createdFile.Close()
	if _, err := createdFile.Write(fileBytes); err != nil || createdFile.Close() != nil {
		c.storage.Delete(f.Id)
		exceptions.BadRequestError(w, r, err.Error(), exceptions.CantParseFile)
		return
	}

	render.JSON(w, r, f)
}

func (c *FileController) GetInfo(w http.ResponseWriter, r *http.Request) {
	file, err := c.storage.Get(chi.URLParam(r, "id"))

	if err != nil {
		exceptions.NotFoundError(w, r, err.Error())
	}

	render.JSON(w, r, file)
}

func (c *FileController) Serve(w http.ResponseWriter, r *http.Request)  {
	f, err := c.storage.Get(chi.URLParam(r, "id"))

	if err != nil {
		exceptions.NotFoundError(w, r, "File not found")
		return
	}

	pathToFile := filepath.Join(c.uploadPath, f.Id + f.Extension)

	http.ServeFile(w, r, pathToFile)
}

func (c *FileController) Delete(w http.ResponseWriter, r *http.Request)  {
	f, err := c.storage.Get(chi.URLParam(r, "id"))
	if err != nil {
		exceptions.NotFoundError(w, r, err.Error())
		return
	}
	err = os.Remove(filepath.Join(c.uploadPath, f.Id + f.Extension))

	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	if err = c.storage.Delete(f.Id); err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	render.Status(r, http.StatusOK)
}