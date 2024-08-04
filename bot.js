const { Bot } = require('grammy');

const token = '7212012237:AAF7HqHhvQUuqLznbDKGcLyRjvM6TnbYS_w';  // Ganti dengan token bot Anda
const bot = new Bot(token);

// Fungsi untuk membuat tombol inline untuk memulai game
const createStartKeyboard = () => ({
    reply_markup: {
        inline_keyboard: [
            [{ text: 'Play', url: 'https://your-web-app-url.vercel.app' }] // Ganti dengan URL aplikasi web Anda
        ]
    }
});
