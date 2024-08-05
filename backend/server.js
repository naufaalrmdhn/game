const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const usersFilePath = path.join(__dirname, 'users.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

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
        console.error('Error writing to users file:', error);
    }
}

// Update points
app.post('/update-points', (req, res) => {
    const { userId, points } = req.body;
    const users = readUsersFile();
    if (!users[userId]) users[userId] = {};
    users[userId].points = points;
    writeUsersFile(users);
    res.json({ success: true });
});

// Get points
app.post('/get-points', (req, res) => {
    const { userId } = req.body;
    const users = readUsersFile();
    const user = users[userId] || {};
    res.json({ points: user.points || 0 });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
