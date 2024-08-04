const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let userStamina = {}; // Simulasi penyimpanan stamina

app.get('/stamina', (req, res) => {
    const userId = req.query.userId;
    if (userStamina[userId] !== undefined) {
        res.json({ stamina: userStamina[userId] });
    } else {
        res.json({ stamina: 10 }); // Default stamina
    }
});

app.post('/update-stamina', (req, res) => {
    const { userId, staminaCost, won } = req.body;
    if (!userStamina[userId]) userStamina[userId] = 10;
    if (won) {
        userStamina[userId] += staminaCost;
    } else {
        userStamina[userId] -= staminaCost;
    }
    res.json({ stamina: userStamina[userId] });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
