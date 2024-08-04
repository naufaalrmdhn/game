const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

let users = {}; // Simulasi penyimpanan data pengguna

// Mendapatkan stamina pengguna
app.get('/stamina', (req, res) => {
    const userId = req.query.userId;
    const stamina = users[userId] ? users[userId].stamina : 0;
    res.json({ stamina });
});

// Memperbarui stamina pengguna
app.post('/update-stamina', (req, res) => {
    const { userId, staminaCost } = req.body;
    if (!users[userId]) {
        users[userId] = { stamina: 10 }; // Inisialisasi stamina
    }
    users[userId].stamina -= staminaCost;
    res.json({ stamina: users[userId].stamina });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
