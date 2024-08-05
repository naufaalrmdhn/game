// script.js
document.addEventListener('DOMContentLoaded', async () => {
    const userId = new URLSearchParams(window.location.search).get('userId');
    const response = await fetch(`http://localhost:3000/user/${userId}`);
    const userData = await response.json();
    const staminaDisplay = document.getElementById('stamina-value');
    const pointsDisplay = document.getElementById('points');
    const timerDisplay = document.getElementById('timer-value');
    let stamina = userData.stamina;
    let points = userData.points;
    let timer;
    let levelImages = [];

    document.getElementById('username').textContent = `User ${userId}`;
    pointsDisplay.textContent = points;
    staminaDisplay.textContent = stamina;

    document.querySelectorAll('.level-button').forEach(button => {
        button.addEventListener('click', () => {
            startGame(button.dataset.level);
        });
    });

    function updateStamina() {
        stamina++;
        staminaDisplay.textContent = stamina;
        fetch(`http://localhost:3000/user/${userId}/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stamina })
        });
    }

    function startGame(level) {
        document.getElementById('level-selection').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        createBoard(level);
        startTimer();
    }

    function startTimer() {
        let seconds = 0;
        timer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${minutes}:${secs}`;
            if (seconds % 120 === 0) {
                updateStamina();
            }
        }, 1000);
    }

    function createBoard(level) {
        const board = document.getElementById('game-board');
        board.innerHTML = '';
        let gridTemplateColumns;
        let gridTemplateRows;
        let images = [];

        switch (level) {
            case 'easy':
                images = [
                    'images/easy/card1.png',
                    'images/easy/card2.png',
                    'images/easy/card3.png'
                ];
                gridTemplateColumns = 'repeat(3, 100px)';
                gridTemplateRows = 'repeat(2, 100px)';
                break;
            case 'normal':
                images = [
                    'images/normal/card1.png',
                    'images/normal/card2.png',
                    'images/normal/card3.png',
                    'images/normal/card4.png'
                ];
                gridTemplateColumns = 'repeat(4, 100px)';
                gridTemplateRows = 'repeat(2, 100px)';
                break;
            case 'hard':
                images = [
                    'images/hard/card1.png',
                    'images/hard/card2.png',
                    'images/hard/card3.png',
                    'images/hard/card4.png',
                    'images/hard/card5.png',
                    'images/hard/card6.png'
                ];
                gridTemplateColumns = 'repeat(4, 100px)';
                gridTemplateRows = 'repeat(3, 100px)';
                break;
        }

        const cards = [...images, ...images].sort(() => 0.5 - Math.random());
        board.style.gridTemplateColumns = gridTemplateColumns;
        board.style.gridTemplateRows = gridTemplateRows;

        cards.forEach(image => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = image;

            const img = document.createElement('img');
            img.src = image;
            card.appendChild(img);

            card.addEventListener('click', () => flipCard(card));
            board.appendChild(card);
        });
    }

    function flipCard(card) {
        if (card.classList.contains('flipped') || document.querySelectorAll('.flipped').length === 2) return;
        card.classList.add('flipped');

        const flippedCards = document.querySelectorAll('.flipped');
        if (flippedCards.length === 2) {
            setTimeout(() => {
                checkForMatch(flippedCards);
            }, 1000);
        }
    }

    function checkForMatch(cards) {
        const [card1, card2] = cards;
        if (card1.dataset.image
            if (card1.dataset.image === card2.dataset.image) {
                // Match found
                points += 100; // Example points increase, adjust based on level
                fetch(`http://localhost:3000/user/${userId}/update`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ points })
                });
                document.getElementById('points').textContent = points;
                card1.classList.add('matched');
                card2.classList.add('matched');
                if (document.querySelectorAll('.card:not(.matched)').length === 0) {
                    clearInterval(timer);
                    alert('Congratulations! You have matched all pairs.');
                    document.getElementById('level-selection').classList.remove('hidden');
                    document.getElementById('game-container').classList.add('hidden');
                }
            } else {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }
        }
    
        function updateStamina() {
            stamina--;
            if (stamina <= 0) {
                clearInterval(timer);
                alert('Game Over! Your stamina has run out.');
                document.getElementById('level-selection').classList.remove('hidden');
                document.getElementById('game-container').classList.add('hidden');
            } else {
                fetch(`http://localhost:3000/user/${userId}/update`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ stamina })
                });
                document.getElementById('stamina-value').textContent = stamina;
            }
        }
    });
    