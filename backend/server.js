const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let users = {};

app.post('/user/:userId/update', (req, res) => {
    const userId = req.params.userId;
    const { points, stamina } = req.body;

    if (!users[userId]) {
        users[userId] = { points: 0, stamina: 10 };
    }

    if (points !== undefined) {
        users[userId].points = points;
    }

    if (stamina !== undefined) {
        users[userId].stamina = stamina;
    }

    res.status(200).json(users[userId]);
});

app.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    res.status(200).json(users[userId] || { points: 0, stamina: 10 });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
