const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const token = '7212012237:AAF7HqHhvQUuqLznbDKGcLyRjvM6TnbYS_w'; // Token API Telegram Bot
const bot = new TelegramBot(token, { polling: true });

const usersFilePath = path.join(__dirname, 'users.json');

// Helper function to read users file
function readUsersFile() {
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
}

// Helper function to write users file
function writeUsersFile(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Telegram Bot Commands
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the Memory Game! Click the button below to play.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Play', web_app: { url: `https://naufallll.vercel.app/?userId=${chatId}` } }]
            ]
        }
    });
});

bot.onText(/\/getusername/, async (msg) => {
    const chatId = msg.chat.id;
    const users = readUsersFile();
    const user = users[chatId] || {};
    const username = user.username || 'unknown';
    bot.sendMessage(chatId, `Username: ${username}`);
});

bot.onText(/\/getstamina/, async (msg) => {
    const chatId = msg.chat.id;
    const users = readUsersFile();
    const user = users[chatId] || {};
    const stamina = user.stamina || 10;
    bot.sendMessage(chatId, `Stamina: ${stamina}`);
});

bot.onText(/\/getpoints/, async (msg) => {
    const chatId = msg.chat.id;
    const users = readUsersFile();
    const user = users[chatId] || {};
    const points = user.points || 0;
    bot.sendMessage(chatId, `Points: ${points}`);
});
