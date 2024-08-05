// server.js
const express = require('express');
const app = express();
const port = 3000;

let users = {};

app.use(express.json());
app.use(express.static('public'));

app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    if (!users[userId]) {
        users[userId] = { stamina: 10, points: 0 };
    }
    res.json(users[userId]);
});

app.post('/user/:id/update', (req, res) => {
    const userId = req.params.id;
    const { stamina, points } = req.body;
    if (!users[userId]) {
        users[userId] = { stamina: 10, points: 0 };
    }
    if (stamina !== undefined) users[userId].stamina = stamina;
    if (points !== undefined) users[userId].points = points;
    res.json(users[userId]);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
