import fetch from 'node-fetch';
import { Telegraf } from 'telegraf';

const bot = new Telegraf('7212012237:AAF7HqHhvQUuqLznbDKGcLyRjvM6TnbYS_w');
const API_URL = 'http://localhost:3000'; // Sesuaikan dengan URL backend Anda

async function getUserStamina(userId) {
    try {
        const response = await fetch(`${API_URL}/stamina?userId=${userId}`);
        const data = await response.json();
        return data.stamina;
    } catch (error) {
        console.error('Error fetching stamina:', error);
        return 0;
    }
}

async function updateUserStamina(userId, staminaCost, won) {
    try {
        const response = await fetch(`${API_URL}/update-stamina`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, staminaCost, won })
        });
        const data = await response.json();
        return data.stamina;
    } catch (error) {
        console.error('Error updating stamina:', error);
        return 0;
    }
}

// Tambahkan logika bot lainnya di sini

bot.launch();
