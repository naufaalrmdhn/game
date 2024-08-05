const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, 'users.json');

// Function to read users file
function readUsersFile() {
    try {
        return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    } catch (error) {
        console.error('Error reading users file:', error);
        return {}; // Return empty object on error
    }
}

// Function to write users file
function writeUsersFile(users) {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing users file:', error);
    }
}

// Function to update points by userId
function updatePoints(userId, newPoints) {
    const users = readUsersFile();
    if (!users[userId]) {
        users[userId] = {}; // Create new user entry if it doesn't exist
    }
    users[userId].points = newPoints;
    writeUsersFile(users);
    console.log(`Updated User ID: ${userId}, New Points: ${newPoints}`);
}

// Replace '6268033420' with the userId you want to update and set new points
const userIdToUpdate = '6268033420';
const newPoints = 500;
updatePoints(userIdToUpdate, newPoints);
