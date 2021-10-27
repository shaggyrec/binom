package dataType

const UtmCookieName = "binomUtm"

var UtmQueryParams = []string{
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_content",
	"utm_term",
	"url",
}

type Utm struct {
	Id string `json:"id"`
	UserId string `json:"userId"`
	UtmSource string `json:"utmSource"`
	UtmMedium string `json:"utmMedium"`
	UtmCampaign string `json:"utmCampaign"`
	UtmContent string `json:"utmContent"`
	UtmTerm string `json:"utmTerm"`
	Url string `json:"url"`
}
