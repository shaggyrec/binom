package scheduler

import (
	"github.com/jasonlvhit/gocron"
	"log"
)

func task()  {
	log.Println("Cron")
}

func Run() {
	gocron.Every(1).Day().At("10:30").Do(task)
}
