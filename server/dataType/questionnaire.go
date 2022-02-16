package dataType

type Questionnaire struct {
	Id        string     `json:"id"`
	Name      string     `json:"name"`
	Questions []Question `pg:"rel:has-many" json:"questions"`
}

type Question struct {
	Id              string `json:"id"`
	Question        string `json:"question"`
	QuestionnaireId string `json:"questionnaireId"`
}

type Answer struct {
	Id         string `json:"id"`
	QuestionId string `json:"questionId"`
	UserId     string `json:"userId"`
	Answer     string `json:"answer"`
}
