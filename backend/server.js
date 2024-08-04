const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

let userData = {}; // Simpan data pengguna dengan ID Telegram sebagai kunci

app.post('/updateUser', (req, res) => {
    const { userId, stamina, points } = req.body;
    userData[userId] = { stamina, points };
    res.status(200).send('User data updated');
});

app.get('/user/:userId', (req, res) => {
    const { userId } = req.params;
    const data = userData[userId] || { stamina: 10, points: 0 }; // Default data if user not found
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
