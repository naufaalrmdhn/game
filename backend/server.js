const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const usersFilePath = path.join(__dirname, 'users.json');

// Helper function to read users file
function readUsersFile() {
    if (!fs.existsSync(usersFilePath)) {
        fs.writeFileSync(usersFilePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
}

// Helper function to write users file
function writeUsersFile(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Get username
app.post('/get-username', (req, res) => {
    const { userId } = req.body;
    const users = readUsersFile();
    if (!users[userId]) {
        users[userId] = { points: 0, stamina: 10 };
        writeUsersFile(users);
    }
    res.json({ userId: userId });
});

// Update stamina
app.post('/update-stamina', (req, res) => {
    const { userId, stamina } = req.body;
    const users = readUsersFile();
    if (!users[userId]) users[userId] = { points: 0, stamina: 10 };
    users[userId].stamina = stamina;
    writeUsersFile(users);
    res.json({ success: true });
});

// Get stamina
app.post('/get-stamina', (req, res) => {
    const { userId } = req.body;
    const users = readUsersFile();
    if (!users[userId]) users[userId] = { points: 0, stamina: 10 };
    const user = users[userId];
    res.json({ stamina: user.stamina });
});

// Update points
app.post('/update-points', (req, res) => {
    const { userId, points } = req.body;
    const users = readUsersFile();
    if (!users[userId]) users[userId] = { points: 0, stamina: 10 };
    users[userId].points = points;
    writeUsersFile(users);
    res.json({ success: true });
});

// Get points
app.post('/get-points', (req, res) => {
    const { userId } = req.body;
    const users = readUsersFile();
    if (!users[userId]) users[userId] = { points: 0, stamina: 10 };
    const user = users[userId];
    res.json({ points: user.points });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
