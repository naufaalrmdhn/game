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
    try {
        return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    } catch (error) {
        console.error('Error reading users file:', error);
        return {}; // Return empty object on error
    }
}

// Helper function to write users file
function writeUsersFile(users) {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing users file:', error);
    }
}

// Get points
app.post('/get-points', (req, res) => {
    const { userId } = req.body;
    const users = readUsersFile();
    const user = users[userId] || {};
    res.json({ points: user.points || 0 });
});

// Update points
app.post('/update-points', (req, res) => {
    const { userId, points } = req.body;
    const users = readUsersFile();
    if (!users[userId]) users[userId] = {};
    users[userId].points = points;
    writeUsersFile(users);
    res.json({ success: true });
});

// Get stamina
app.post('/get-stamina', (req, res) => {
    const { userId } = req.body;
    const users = readUsersFile();
    const user = users[userId] || {};
    res.json({ stamina: user.stamina || 10 });
});

// Update stamina
app.post('/update-stamina', (req, res) => {
    const { userId, stamina } = req.body;
    const users = readUsersFile();
    if (!users[userId]) users[userId] = {};
    users[userId].stamina = stamina;
    writeUsersFile(users);
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
