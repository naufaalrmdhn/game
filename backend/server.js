const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const usersFile = './users.json';

// Helper function to read users file
function readUsersFile() {
    if (!fs.existsSync(usersFile)) {
        fs.writeFileSync(usersFile, JSON.stringify({}));
    }
    const data = fs.readFileSync(usersFile);
    return JSON.parse(data);
}

// Helper function to write users file
function writeUsersFile(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Endpoint to get username
app.post('/get-username', (req, res) => {
    const { userId } = req.body;
    const users = readUsersFile();
    const user = users[userId] || { userId: userId, username: '', points: 0, stamina: 10 };
    res.json(user);
});

// Endpoint to get stamina
app.post('/get-stamina', (req, res) => {
    const { userId } = req.body;
    const users = readUsersFile();
    const user = users[userId] || { userId: userId, username: '', points: 0, stamina: 10 };
    res.json({ stamina: user.stamina });
});

// Endpoint to get points
app.post('/get-points', (req, res) => {
    const { userId } = req.body;
    const users = readUsersFile();
    const user = users[userId] || { userId: userId, username: '', points: 0, stamina: 10 };
    res.json({ points: user.points });
});

// Endpoint to update stamina
app.post('/update-stamina', (req, res) => {
    const { userId, stamina } = req.body;
    const users = readUsersFile();
    if (!users[userId]) {
        users[userId] = { userId: userId, username: '', points: 0, stamina: 10 };
    }
    users[userId].stamina = stamina;
    writeUsersFile(users);
    res.json({ message: 'Stamina updated successfully' });
});

// Endpoint to update points
app.post('/update-points', (req, res) => {
    const { userId, points } = req.body;
    const users = readUsersFile();
    if (!users[userId]) {
        users[userId] = { userId: userId, username: '', points: 0, stamina: 10 };
    }
    users[userId].points = points;
    writeUsersFile(users);
    res.json({ message: 'Points updated successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
