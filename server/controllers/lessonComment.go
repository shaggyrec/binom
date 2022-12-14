package controllers

import (
	"binom/server/dataType"
	exceptions "binom/server/exceptions"
	"binom/server/functions"
	"binom/server/service"
	"binom/server/storage"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"gopkg.in/guregu/null.v4"
	"log"
	"net/http"
)

type LessonCommentController struct {
	lessonCommentStorage *storage.LessonCommentStorage
	notificationService  *service.NotificationService
	userStorage          *storage.UserStorage
	progressStorage      *storage.ProgressStorage
}

func (c *LessonCommentController) Init(lessonCommentStorage *storage.LessonCommentStorage, notificationService *service.NotificationService, userStorage *storage.UserStorage, progressStorage *storage.ProgressStorage) {
	c.lessonCommentStorage = lessonCommentStorage
	c.notificationService = notificationService
	c.userStorage = userStorage
	c.progressStorage = progressStorage
}

func (c *LessonCommentController) List(w http.ResponseWriter, r *http.Request) {
	lessonId := chi.URLParam(r, "lesson")
	userId := chi.URLParam(r, "userId")
	comments, err := c.lessonCommentStorage.List(lessonId, userId)
	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}
	functions.RenderJSON(w, r, *comments)
}

func (c *LessonCommentController) Add(w http.ResponseWriter, r *http.Request) {
	lessonId := chi.URLParam(r, "lesson")
	userId := chi.URLParam(r, "userId")
	var comment dataType.LessonComment
	if err := functions.ParseRequest(w, r, &comment); err != nil {
		return
	}

	if comment.Text.String == "" && len(comment.Files) == 0 {
		exceptions.BadRequestError(w, r, "Text or files are required", exceptions.ErrorBadParam)
		return
	}

	comment.UserId = userId
	comment.LessonId = lessonId
	comment.AuthorId = r.Context().Value("userId").(string)
	userRole := r.Context().Value("userRole").(int)

	if comment.AuthorId != userId && userRole != dataType.UserRoleAdmin {
		exceptions.NotFoundError(w, r, "You have no access")
		return
	}

	_, err := c.lessonCommentStorage.Create(&comment)

	if err != nil {
		log.Print(err)
		exceptions.ServerError(w, r)
		return
	}

	if comment.Files != nil && len(comment.Files) > 0 {
		for _, file := range comment.Files {
			_, err := c.lessonCommentStorage.AddFile(&dataType.LessonCommentFile{
				FileId:          file.FileId,
				LessonCommentId: comment.Id,
			})
			if err != nil {
				log.Print(err)
				exceptions.ServerError(w, r)
				return
			}
		}
	}
	newLessonComment, _ := c.lessonCommentStorage.ById(comment.Id)

	notificationLength := 100
	notificationText := comment.Text.String
	if len(comment.Text.String) > notificationLength {
		notificationText = comment.Text.String[:notificationLength] + "..."
	}
	if len(comment.Files) > 0 {
		notificationText += " + ??????????"
		// ???????? ???????? ???????????????? ???????? ???????????? ???????? ??????????????????????
		if userId == comment.AuthorId {
			_, err = c.progressStorage.MakeFinished(lessonId, userId)
		}
	}

	n := &dataType.Notification{
		Type:     null.IntFrom(dataType.NotificationLessonComment),
		Message:  notificationText,
		Meta:     dataType.NotificationMeta{Lesson: lessonId, Comment: newLessonComment.Id},
		AuthorId: comment.AuthorId,
	}

	// ???????? ?????????? ?????? ????????, ???? ?????????????????????? ??????????????
	if userId == comment.AuthorId {
		user, _ := c.userStorage.Get(userId)
		n.Message = fmt.Sprintf("???????????????????????? %s(%s) ?????????? %s", user.Name.String, user.Username.String, n.Message)
		err = c.notificationService.CreateForAdmins(n)
	} else {
		// ???????? ?????????????? ?????????? ???? ?????????????????????? ??????????
		err = c.notificationService.Create(n, []string{userId})
	}

	if err != nil {
		log.Print(err)
	}

	render.JSON(w, r, newLessonComment)
}

func (c *LessonCommentController) Delete(w http.ResponseWriter, r *http.Request) {
	// commentId := chi.URLParam(r, "id")
}

func (c *LessonCommentController) Update(w http.ResponseWriter, r *http.Request) {
	// commentId := chi.URLParam(r, "id")
}
