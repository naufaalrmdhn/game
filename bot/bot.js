const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');
const bot = new Telegraf('7212012237:AAF7HqHhvQUuqLznbDKGcLyRjvM6TnbYS_w'); // Ganti dengan token bot Anda

const FRONTEND_URL = 'https://naufallll.vercel.app/';

bot.command('start', (ctx) => {
    ctx.reply('Welcome to the Memory Game! Click Play to start.', {
        reply_markup: {
            keyboard: [
                [{ text: 'Play', url: `${FRONTEND_URL}` }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
});

bot.launch();
