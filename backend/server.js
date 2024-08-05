const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const usersFilePath = './users.json';
let users = {}; // Initialize an empty object

// Load users from file
if (fs.existsSync(usersFilePath)) {
    users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
}

// Middleware to update stamina every minute
setInterval(() => {
    const now = Date.now();
    for (const userId in users) {
        const user = users[userId];
        if (user.stamina < 10) { // Example max stamina
            const timeDiff = now - user.lastUpdated;
            if (timeDiff >= 60000) { // 1 minute
                user.stamina = Math.min(user.stamina + 1, 10);
                user.lastUpdated = now;
                saveUsers();
            }
        }
    }
}, 60000);

app.post('/update-points', (req, res) => {
    const { userId, points } = req.body;

    if (!users[userId]) {
        users[userId] = { stamina: 10, points: 0, lastUpdated: Date.now() };
    }

    users[userId].points += points;
    saveUsers();
    res.sendStatus(200);
});

app.post('/update-stamina', (req, res) => {
    const { userId } = req.body;
    if (!users[userId]) {
        users[userId] = { stamina: 10, points: 0, lastUpdated: Date.now() };
    }

    res.json({ stamina: users[userId].stamina });
});

function saveUsers() {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
