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
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
}

// Helper function to write users file
function writeUsersFile(data) {
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf8');
}

app.post('/get-username', (req, res) => {
    const { userId } = req.body;
    const users = readUsersFile();
    const user = users[userId] || {};
    res.json({ username: user.username || 'unknown' });
});

app.post('/update-stamina', (req, res) => {
    const { userId, stamina } = req.body;
    const users = readUsersFile();
    if (!users[userId]) users[userId] = {};
    users[userId].stamina = stamina;
    writeUsersFile(users);
    res.sendStatus(200);
});

app.post('/update-points', (req, res) => {
    const { userId, points } = req.body;
    const users = readUsersFile();
    if (!users[userId]) users[userId] = {};
    users[userId].points = points;
    writeUsersFile(users);
    res.sendStatus(200);
});

app.post('/get-stamina', (req, res) => {
    const { userId } = req.body;
    const users = readUsersFile();
    const user = users[userId] || {};
    res.json({ stamina: user.stamina || 10 });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
