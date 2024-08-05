const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const users = {};

app.post('/user/:id/update', (req, res) => {
    const userId = req.params.id;
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

    res.send(users[userId]);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
