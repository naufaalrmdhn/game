document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const status = document.getElementById('status');
    const restartButton = document.getElementById('restart-button');
    const userId = getUserIdFromUrl(); // Implement this function to get userId

    let firstCard = null;
    let lockBoard = false;
    let matchCount = 0;
    let currentLevel = null;

    document.getElementById('easy-button').addEventListener('click', () => startGame('easy'));
    document.getElementById('normal-button').addEventListener('click', () => startGame('normal'));
    document.getElementById('hard-button').addEventListener('click', () => startGame('hard'));
    restartButton.addEventListener('click', () => window.location.reload());

    function startGame(level) {
        currentLevel = level;
        fetch(`http://localhost:3000/user/${userId}`)
            .then(response => response.json())
            .then(user => {
                if (user.stamina <= 0) {
                    status.innerText = 'You have no stamina left.';
                    return;
                }
                initializeGameBoard(level);
                status.innerText = 'Match the cards!';
                restartButton.style.display = 'none';
            })
            .catch(err => {
                status.innerText = 'Error fetching user data.';
                console.error(err);
            });
    }

    function initializeGameBoard(level) {
        gameBoard.innerHTML = ''; // Clear previous game board
        const totalCards = getTotalCards(level);
        const cardValues = generateCardValues(totalCards);
        for (const value of cardValues) {
            const card = document.createElement('div');
            card.className = 'game-cell';
            card.dataset.value = value;
            card.addEventListener('click', () => handleCardClick(card));
            gameBoard.appendChild(card);
        }
    }

    function handleCardClick(card) {
        if (lockBoard || card.classList.contains('flipped') || card === firstCard) return;

        card.textContent = card.dataset.value;
        card.classList.add('flipped');

        if (!firstCard) {
            firstCard = card;
            return;
        }

        lockBoard = true;
        setTimeout(() => {
            checkForMatch(card);
        }, 1000);
    }

    function checkForMatch(secondCard) {
        if (firstCard.dataset.value === secondCard.dataset.value) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            matchCount += 2;
            if (matchCount === document.querySelectorAll('.game-cell').length) {
                status.innerText = 'You won!';
                restartButton.style.display = 'block';
                updateUser(userId, currentLevel, true);
            }
        } else {
            firstCard.textContent = '';
            secondCard.textContent = '';
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
        }
        firstCard = null;
        lockBoard = false;
    }

    function generateCardValues(totalCards) {
        const values = [];
        for (let i = 0; i < totalCards / 2; i++) {
            values.push(i + 1, i + 1);
        }
        return shuffle(values);
    }

    function getTotalCards(level) {
        const boardDimensions = {
            easy: 9,   // 3x3
            normal: 8, // 2x4
            hard: 12   // 3x4
        };
        return boardDimensions[level] || 9;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function updateUser(userId, level, won) {
        fetch(`http://localhost:3000/updateUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, level, won })
        })
        .then(response => response.json())
        .then(data => console.log('User updated:', data))
        .catch(err => console.error('Error updating user:', err));
    }

    function getUserIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('userId');
    }
});
