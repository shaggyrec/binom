package telegramBot

import (
	"strconv"
)

func InstantiateBotForChat(tgBot *Bot, chatIdFromEnv string) *BotForChat {
	tgTechChatId, _ := strconv.Atoi(chatIdFromEnv)
	b := BotForChat{}
	b.Init(tgBot, int64(tgTechChatId))
	return &b
}


type BotForChat struct {
	bot *Bot
	chatId int64
}

func (b *BotForChat) Init (bot *Bot, chatId int64) {
	b.bot = bot
	b.chatId = chatId
}

func (b *BotForChat) Message(msg string) error {
	if b == nil {
		return nil
	}
	if b.bot == nil {
		return nil
	}
	return b.bot.Message(b.chatId, msg)
}
