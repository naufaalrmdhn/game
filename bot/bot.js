import fetch from 'node-fetch';
import { Telegraf } from 'telegraf';

const bot = new Telegraf('7212012237:AAF7HqHhvQUuqLznbDKGcLyRjvM6TnbYS_w');  // Ganti dengan token bot Anda

const STAMINA_API_URL = 'http://localhost:3000/stamina';  // URL backend untuk stamina
const UPDATE_STAMINA_API_URL = 'http://localhost:3000/update-stamina';  // URL backend untuk update stamina
const GAME_FRONTEND_URL = 'https://naufallll.vercel.app';  // URL frontend Anda di Vercel

bot.command('start', (ctx) => {
    ctx.reply('Welcome to the Memory Game! Type /play to start playing.');
});

bot.command('play', async (ctx) => {
    const userId = ctx.from.id;

    try {
        const response = await fetch(`${STAMINA_API_URL}?userId=${userId}`);
        const data = await response.json();

        if (data.stamina > 0) {
            ctx.reply('Game started! Please choose your level: easy, normal, or hard.');
        } else {
            ctx.reply('You do not have enough stamina to play. Please wait a while before trying again.');
        }
    } catch (error) {
        console.error('Error fetching stamina:', error);
        ctx.reply('There was an error fetching your stamina. Please try again later.');
    }
});

bot.hears(/^(easy|normal|hard)$/, async (ctx) => {
    const userId = ctx.from.id;
    const level = ctx.match[0];

    try {
        const response = await fetch(`${STAMINA_API_URL}?userId=${userId}`);
        const data = await response.json();
        const currentStamina = data.stamina;

        const staminaCost = getLevelCost(level);
        if (currentStamina >= staminaCost) {
            await fetch(UPDATE_STAMINA_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, amount: -staminaCost })
            });

            ctx.reply(`You chose ${level} level. Start the game here: <a href="${GAME_FRONTEND_URL}">Play Game</a>`, { parse_mode: 'HTML' });
        } else {
            ctx.reply('You do not have enough stamina to play this level. Please wait or try another level.');
        }
    } catch (error) {
        console.error('Error handling level selection:', error);
        ctx.reply('There was an error starting the game. Please try again later.');
    }
});

function getLevelCost(level) {
    switch (level) {
        case 'easy':
            return 1;
        case 'normal':
            return 3;
        case 'hard':
            return 5;
        default:
            return 0;
    }
}

bot.launch();
