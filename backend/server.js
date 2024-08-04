const express = require('express');
const app = express();
const port = 3000;

let userStamina = {}; // In-memory storage for user stamina

app.use(express.json());

// Endpoint to get stamina
app.get('/stamina/:userId', (req, res) => {
    const userId = req.params.userId;
    const stamina = userStamina[userId] || { stamina: 10, lastUpdate: Date.now() }; // Default stamina to 10
    res.json(stamina);
});

// Endpoint to update stamina (called periodically)
app.post('/update-stamina', (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    if (!userStamina[userId]) {
        userStamina[userId] = { stamina: 10, lastUpdate: Date.now() }; // Default stamina to 10
    }

    const now = Date.now();
    const elapsedTime = now - userStamina[userId].lastUpdate;
    const newStamina = Math.floor(elapsedTime / (2 * 60 * 1000)); // Increase stamina every 2 minutes

    userStamina[userId].stamina = Math.min(10, userStamina[userId].stamina + newStamina); // Max stamina 10
    userStamina[userId].lastUpdate = now;

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
