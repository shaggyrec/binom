package telegramBot

import (
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
	"log"
)

type Bot struct {
	bot *tgbotapi.BotAPI
}

func Instantiate(token string) *Bot {
	bot := Bot{}
	bot.Init(token)
	return &bot
}

func (tgBot *Bot) Init(token string) error {
	b, err := tgbotapi.NewBotAPI(token)
	if err != nil {
		log.Println(err)
		return err
	}
	tgBot.bot = b
	return nil
}

func (tgBot *Bot) Message(chatId int64, msg string) error {
	_, err := tgBot.bot.Send(tgbotapi.NewMessage(chatId, msg))
	log.Println("telegramBot error")
	log.Println(err)
	return err
}