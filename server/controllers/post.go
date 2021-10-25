package controllers

import (
	"binom/server/dataType"
	"binom/server/dbQuery"
	"binom/server/exceptions"
	"binom/server/functions"
	"binom/server/storage"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/go-pg/pg"
	"log"
	"net/http"
	"strconv"
)

type PostController struct {
	postStorage *storage.PostStorage
	db *pg.DB
}

func (c *PostController) Init(postStorage *storage.PostStorage, db *pg.DB) {
	c.postStorage = postStorage
	c.db = db
}

func (c *PostController) Create(w http.ResponseWriter, r *http.Request) {
	var p dataType.Post
	if err := functions.ParseRequest(w, r, &p);  err != nil {
		return
	}

	if p.Text == "" {
		exceptions.BadRequestError(w, r, "`text` is mandatory", exceptions.ErrorFieldIsMandatory)
		return
	}
	p.UserId = r.Context().Value("userId").(string)
	_, err := c.postStorage.Create(&p)

	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	render.JSON(w, r, p)
}

func (c *PostController) Update(w http.ResponseWriter, r *http.Request) {
	var lessonToUpdate map[string]interface{}
	if err := functions.ParseRequest(w, r, &lessonToUpdate);  err != nil {
		return
	}

	if !c.assertAccessToPost(w, r) {
		return
	}

	err := c.postStorage.Update(chi.URLParam(r, "id"), lessonToUpdate)

	if err != nil {
		log.Print(err)
		exceptions.BadRequestError(w, r, err.Error(), exceptions.NothingAffected)
		return
	}

	render.JSON(w, r, "ok")
}

func (c *PostController) Delete(w http.ResponseWriter, r *http.Request) {
	if !c.assertAccessToPost(w, r) {
		return
	}
	err := c.postStorage.Delete(chi.URLParam(r, "id"))
	if err != nil {
		exceptions.BadRequestError(w, r, err.Error(), exceptions.NothingAffected)
	}
	render.JSON(w, r, "ok")
}

func (c *PostController) List(w http.ResponseWriter, r *http.Request) {
	limit := 50
	offset := 0
	limitFromRequest := r.URL.Query().Get("limit")
	offsetFromRequest := r.URL.Query().Get("offset")
	user := chi.URLParam(r, "user")

	if limitFromRequest != "" {
		limit, _ = strconv.Atoi(limitFromRequest)
	}

	if offsetFromRequest != "" {
		offset, _ = strconv.Atoi(offsetFromRequest)
	}
	var posts *[]dataType.Post
	var err error

	postsDbQuery := dbQuery.Posts(c.db).Limit(limit).Offset(offset)
	if user != "" {
		postsDbQuery.Username(user)
	}

	posts, err = postsDbQuery.WithComments(3).Get()

	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}
	functions.RenderJSON(w, r, *posts)
}

func (c *PostController) Like(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	p, err := c.postStorage.ById(id)

	if err != nil {
		exceptions.NotFoundError(w, r, "post no found")
		return
	}
	userId := r.Context().Value("userId").(string)
	userLikeIndex := functions.IndexOf(p.Likes, userId)
	likes := p.Likes

	if userLikeIndex == -1 {
		likes = append(p.Likes, userId)
	} else {
		likes = append(p.Likes[:userLikeIndex], p.Likes[userLikeIndex+1:]...)
	}
	err = c.postStorage.Update(
		id,
		map[string]interface{}{"likes": likes},
	)

	if err != nil {
		log.Println(err)
		exceptions.ServerError(w, r)
		return
	}

	render.JSON(w, r, "Ok")
}

func (c *PostController) assertAccessToPost(w http.ResponseWriter, r *http.Request) bool {
	post, err := c.postStorage.ById(chi.URLParam(r, "id"))
	if err != nil {
		exceptions.NotFoundError(w, r, "Posts not found")
		return false
	}
	if post.UserId != r.Context().Value("userId").(string) {
		exceptions.Forbidden(w, r, "Forbidden")
		return false
	}

	return true
}