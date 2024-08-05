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
        users[userId] = { stamina: 10, points: 0 };
        res.json(users[userId]);
    }
});

app.post('/updateUser', (req, res) => {
    const { userId, level, won } = req.body;
    if (users[userId]) {
        let staminaCost;
        if (level === 'easy') staminaCost = 1;
        if (level === 'normal') staminaCost = 3;
        if (level === 'hard') staminaCost = 5;
        if (users[userId].stamina >= staminaCost) {
            users[userId].stamina -= staminaCost;
            if (won) {
                let pointsEarned;
                if (level === 'easy') pointsEarned = 100;
                if (level === 'normal') pointsEarned = 300;
                if (level === 'hard') pointsEarned = 500;
                users[userId].points += pointsEarned;
            }
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
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
