import { Telegraf } from 'telegraf';

const bot = new Telegraf('7212012237:AAF7HqHhvQUuqLznbDKGcLyRjvM6TnbYS_w');

bot.start(async (ctx) => {
    const userId = ctx.from.id;
    const response = await fetch('http://localhost:3000/stamina', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    ctx.reply(`Welcome! Your stamina is ${data.stamina}`);
});

bot.command('play', (ctx) => {
    ctx.reply('Please select a level: /easy, /normal, /hard');
});

bot.command('easy', async (ctx) => {
    await handleLevel(ctx, 1, 100);
});

bot.command('normal', async (ctx) => {
    await handleLevel(ctx, 3, 300);
});

bot.command('hard', async (ctx) => {
    await handleLevel(ctx, 5, 500);
});

async function handleLevel(ctx, cost, points) {
    const userId = ctx.from.id;
    const response = await fetch('http://localhost:3000/stamina', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    
    if (data.stamina >= cost) {
        await fetch('http://localhost:3000/stamina/decrease', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, cost }),
        });
        
        // Simulate game logic here
        const gameResult = Math.random() > 0.5; // Random win or lose
        
        if (gameResult) {
            await fetch('http://localhost:3000/stamina/addPoints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, points }),
            });
            ctx.reply(`You won! Your stamina is now ${data.stamina - cost} and your points increased by ${points}`);
        } else {
            ctx.reply(`You lost. Your stamina is now ${data.stamina - cost}`);
        }
    } else {
        ctx.reply('Not enough stamina!');
    }
}

bot.launch();
