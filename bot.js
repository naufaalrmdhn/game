



const { Bot } = require('grammy');

const token = '7212012237:AAF7HqHhvQUuqLznbDKGcLyRjvM6TnbYS_w';  // Ganti dengan token bot Anda
const bot = new Bot(token);

// Fungsi untuk membuat tombol inline dengan Web App
const createStartKeyboard = () => ({
    reply_markup: {
        inline_keyboard: [
            [{ 
                text: 'Play', 
                web_app: { url: 'https://naufallll.vercel.app/' } // Ganti dengan URL aplikasi web Anda
            }]
        ]
    }
});

// Menangani perintah /start
bot.command('start', (ctx) => {
    ctx.reply('Welcome to the Memory Game! Click Play to start.', createStartKeyboard());
});

// Jalankan bot
bot.start();
