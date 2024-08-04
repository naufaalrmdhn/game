const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

const bot = new Telegraf('7212012237:AAF7HqHhvQUuqLznbDKGcLyRjvM6TnbYS_w');
const FRONTEND_URL = 'https://naufallll.vercel.app/'; // URL frontend yang di-host di Vercel

const updateUser = async (userId, level, won) => {
    let user = { stamina: 10, points: 0 };

    // Fetch current user data
    const response = await fetch(`http://localhost:3000/user/${userId}`);
    user = await response.json();

    // Deduct stamina
    const staminaCost = { easy: 1, normal: 3, hard: 5 };
    user.stamina -= staminaCost[level];

    if (user.stamina < 0) {
        user.stamina = 0;
        return;
    }

    // Update points
    const pointsReward = { easy: 100, normal: 300, hard: 500 };
    if (won) {
        user.points += pointsReward[level];
    }

    // Update the user data on the backend
    await fetch('http://localhost:3000/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, stamina: user.stamina, points: user.points }),
    });
};

bot.command('start', (ctx) => {
    ctx.reply('Welcome to the Memory Game! Click Play to start.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Play', callback_data: 'play' }],
            ],
        },
    });
});

bot.action('play', (ctx) => {
    ctx.reply('Choose your level:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Easy', callback_data: 'level_easy' }],
                [{ text: 'Normal', callback_data: 'level_normal' }],
                [{ text: 'Hard', callback_data: 'level_hard' }],
            ],
        },
    });
});

bot.action(/level_(easy|normal|hard)/, async (ctx) => {
    const level = ctx.match[1];
    const userId = ctx.from.id;

    // Update user data
    await updateUser(userId, level, false); // false means the user has not won yet

    // Send link to the game with level as a parameter
    const gameUrl = `${FRONTEND_URL}?level=${level}&userId=${userId}`;
    ctx.reply(`You selected ${level.charAt(0).toUpperCase() + level.slice(1)} level. Click the link below to start the game:\n${gameUrl}`);
});

bot.launch();
