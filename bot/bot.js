const { Telegraf, Markup } = require('telegraf');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const bot = new Telegraf('7212012237:AAF7HqHhvQUuqLznbDKGcLyRjvM6TnbYS_w');
const FRONTEND_URL = 'https://naufallll.vercel.app';

// Function to get user data
async function getUser(userId) {
    const response = await fetch(`http://localhost:3000/user/${userId}`);
    return response.json();
}

// Function to update user data
async function updateUser(userId, level, won) {
    const response = await fetch('http://localhost:3000/updateUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, level, won })
    });
    return response.json();
}

// Start command with web app button to choose level
bot.command('start', async (ctx) => {
    const userId = ctx.from.id;

    // Initialize user stamina and points if not already done
    await getUser(userId).catch(async () => {
        await fetch('http://localhost:3000/initUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });
    });

    ctx.reply('Welcome to the Memory Game! Click Play to start.', 
        Markup.inlineKeyboard([
            Markup.button.webApp('Play', `${FRONTEND_URL}?userId=${userId}`)
        ])
    );
});

// Middleware to handle any errors
bot.catch((err) => {
    console.error('Error:', err);
});

bot.launch();

console.log('Bot is running...');
