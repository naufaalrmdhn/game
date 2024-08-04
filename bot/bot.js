import fetch from 'node-fetch';
import { Telegraf } from 'telegraf';

const bot = new Telegraf('7212012237:AAF7HqHhvQUuqLznbDKGcLyRjvM6TnbYS_w');

// Function to get user stamina from server
async function getUserStamina(userId) {
    const response = await fetch(`http://localhost:3000/stamina/${userId}`);
    const data = await response.json();
    return data.stamina;
}

// Function to update user stamina on server
async function updateUserStamina(userId) {
    await fetch('http://localhost:3000/update-stamina', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
    });
}

bot.start(async (ctx) => {
    const userId = ctx.from.id;
    await updateUserStamina(userId); // Ensure stamina is updated and initialized
    const stamina = await getUserStamina(userId);

    ctx.reply(`Welcome! Your current stamina is ${stamina}.`);
});

bot.command('play', async (ctx) => {
    const userId = ctx.from.id;
    const stamina = await getUserStamina(userId);

    if (stamina < 1) {
        ctx.reply('Sorry, you do not have enough stamina to play.');
        return;
    }

    // Show level options
    ctx.reply('Select a level to play:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Easy', callback_data: 'easy' }],
                [{ text: 'Normal', callback_data: 'normal' }],
                [{ text: 'Hard', callback_data: 'hard' }]
            ]
        }
    });
});

bot.on('callback_query', async (ctx) => {
    const userId = ctx.from.id;
    const stamina = await getUserStamina(userId);

    const level = ctx.callbackQuery.data;
    if ((level === 'easy' && stamina < 1) || (level === 'normal' && stamina < 3) || (level === 'hard' && stamina < 5)) {
        ctx.reply('Sorry, you do not have enough stamina to play this level.');
        return;
    }

    // Deduct stamina based on the level
    let staminaCost = 1;
    if (level === 'normal') staminaCost = 3;
    if (level === 'hard') staminaCost = 5;

    // Update user stamina
    await fetch('http://localhost:3000/update-stamina', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
    });

    const gameUrl = `https://naufallll.vercel.app/game.html?level=${level}`;
    ctx.reply(`Starting ${level} game... [Click here to play](${gameUrl})`, { parse_mode: 'Markdown' });
});

bot.launch();
