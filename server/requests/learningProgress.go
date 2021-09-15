package requests

type UpdateUsersProgressByLessonRequest struct {
	Passed bool `json:"passed"`
	PassedTasks int `json:"passedTasks"`
	MaxTasks int `json:"maxTasks"`
}
