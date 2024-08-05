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
function writeUsersFile(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Get user data
app.post('/get-user', (req, res) => {
    const { userId } = req.body;
    const users = readUsersFile();
    const user = users[userId] || {};
    res.json({ 
        userId: userId,
        points: user.points || 0,
        stamina: user.stamina || 10 
    });
});

// Update user data
app.post('/update-user', (req, res) => {
    const { userId, points, stamina } = req.body;
    const users = readUsersFile();
    if (!users[userId]) users[userId] = {};
    if (points !== undefined) users[userId].points = points;
    if (stamina !== undefined) users[userId].stamina = stamina;
    writeUsersFile(users);
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
