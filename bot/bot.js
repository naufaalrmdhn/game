const { Telegraf } = require('telegraf');
const bot = new Telegraf('7212012237:AAF7HqHhvQUuqLznbDKGcLyRjvM6TnbYS_w');

bot.command('start', (ctx) => {
    const userId = ctx.from.id;
    ctx.reply('Welcome to the Memory Game! Click the button below to play.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Play', web_app: { url: `https://game-green-tau.vercel.app/?userId=${userId}` } }]
            ]
        }
    });
});

bot.launch();

