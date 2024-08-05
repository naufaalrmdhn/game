const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let users = {
    "exampleUserId": { stamina: 10, points: 0 }
};

app.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    if (users[userId]) {
        res.json(users[userId]);
    } else {
        users[userId] = { stamina: 10, points: 0 }; // User baru
        res.json(users[userId]);
    }
});

app.post('/updateUser', (req, res) => {
    const { userId, level, won } = req.body;
    if (users[userId]) {
        const staminaCost = { easy: 1, normal: 3, hard: 5 }[level];
        if (won) {
            users[userId].points += level === 'easy' ? 100 : level === 'normal' ? 300 : 500;
        }
        users[userId].stamina -= staminaCost;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.post('/increaseStamina', (req, res) => {
    const { userId } = req.body;
    if (users[userId]) {
        users[userId].stamina++;
        res.json({ success: true, stamina: users[userId].stamina });
    } else {
        res.json({ success: false });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
