const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const getAPIData = async (topic = '') => {
    try {
        const response = await axios.get(`https://meme-api.com/gimme/${topic}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

bot.onText(/^\/meme$/, async (msg) => {
    const randomImage = await getAPIData();
    bot.sendPhoto(msg.chat.id, randomImage.url);
});

bot.onText(/\/memetopic/, async (msg) => {
    bot.sendMessage(msg.chat.id, 'Выберите топик', {
        reply_markup: {
            keyboard: [['JoJoMemes', 'Genshin_Memepact']],
            one_time_keyboard: true,
        },
    });
});

bot.on('message', async (msg) => {
    const messageText = msg.text;
    if (['JoJoMemes', 'Genshin_Memepact'].includes(messageText)) {
        const randomImage = await getAPIData(messageText);
        bot.sendPhoto(msg.chat.id, randomImage.url);
    }
});

bot.on('polling_error', (error) => {
    console.error(error);
});
