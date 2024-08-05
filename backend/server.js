const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let users = {}; // Simulasi database untuk menyimpan data pengguna

app.post('/updateUser', (req, res) => {
    const { userId, points } = req.body;
    if (!users[userId]) {
        users[userId] = { points: 0, stamina: 10 };
    }
    users[userId].points = points;
    res.sendStatus(200);
});

app.post('/increaseStamina', (req, res) => {
    const { userId } = req.body;
    if (users[userId]) {
        users[userId].stamina = (users[userId].stamina || 10) + 1;
    }
    res.sendStatus(200);
});

app.get('/getUserData', (req, res) => {
    const { userId } = req.query;
    const userData = users[userId] || { points: 0, stamina: 10 };
    res.json(userData);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
