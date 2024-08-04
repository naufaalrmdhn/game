const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let users = {}; // Simpan data pengguna di memori (gunakan database untuk penyimpanan lebih baik)

app.post('/stamina/increase', (req, res) => {
    const userId = req.body.userId;
    if (!users[userId]) {
        users[userId] = { stamina: 10, points: 0 };
    }
    users[userId].stamina += 1;
    res.json({ stamina: users[userId].stamina });
});

app.post('/stamina/decrease', (req, res) => {
    const userId = req.body.userId;
    const cost = req.body.cost;
    if (!users[userId]) {
        users[userId] = { stamina: 10, points: 0 };
    }
    if (users[userId].stamina >= cost) {
        users[userId].stamina -= cost;
        res.json({ stamina: users[userId].stamina });
    } else {
        res.status(400).json({ error: 'Not enough stamina' });
    }
});

app.post('/stamina/addPoints', (req, res) => {
    const userId = req.body.userId;
    const points = req.body.points;
    if (!users[userId]) {
        users[userId] = { stamina: 10, points: 0 };
    }
    users[userId].points += points;
    res.json({ points: users[userId].points });
});

app.get('/stamina', (req, res) => {
    const userId = req.query.userId;
    if (!users[userId]) {
        users[userId] = { stamina: 10, points: 0 };
    }
    res.json({ stamina: users[userId].stamina });
});

app.get('/points', (req, res) => {
    const userId = req.query.userId;
    if (!users[userId]) {
        users[userId] = { stamina: 10, points: 0 };
    }
    res.json({ points: users[userId].points });
});

setInterval(() => {
    for (const userId in users) {
        if (users[userId]) {
            users[userId].stamina += 1;
        }
    }
}, 2 * 60 * 1000); // Tambah stamina setiap 2 menit

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
