document.addEventListener('DOMContentLoaded', () => {
    const cardImages = {
        easy: [
            'images/easy/card1.png',
            'images/easy/card2.png',
            'images/easy/card3.png'
        ],
        normal: [
            'images/normal/card1.png',
            'images/normal/card2.png',
            'images/normal/card3.png',
            'images/normal/card4.png'
        ],
        hard: [
            'images/hard/card1.png',
            'images/hard/card2.png',
            'images/hard/card3.png',
            'images/hard/card4.png',
            'images/hard/card5.png',
            'images/hard/card6.png'
        ]
    };

    const board = document.getElementById('game-board');
    const startButton = document.getElementById('start-button');
    const levelSelection = document.getElementById('level-selection');
    const levelButtons = document.querySelectorAll('.level-button');
    const usernameElement = document.getElementById('username');
    const pointsElement = document.getElementById('points');
    const staminaElement = document.getElementById('stamina');
    const timerElement = document.getElementById('timer');
    let cardElements = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let selectedLevel = '';
    let userId = localStorage.getItem('userId') || 'unknown';
    let points = 0;
    let stamina = 10;
    let timerInterval;

    // Fetch username and update UI
    async function fetchUsername() {
        const response = await fetch('/get-username', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId })
        });
        const data = await response.json();
        usernameElement.textContent = `Username: ${data.username || 'unknown'}`;
    }

    async function fetchStamina() {
        const response = await fetch('/get-stamina', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId })
        });
        const data = await response.json();
        stamina = data.stamina || 10;
        staminaElement.textContent = `Stamina: ${stamina}`;
    }

    function updateUI() {
        pointsElement.textContent = `Points: ${points}`;
        staminaElement.textContent = `Stamina: ${stamina}`;
    }

    function startTimer() {
        let time = 0;
        timerElement.textContent = 'Timer: 0:00';
        timerInterval = setInterval(() => {
            time++;
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            timerElement.textContent = `Timer: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    async function updateStamina() {
        if (stamina < 10) {
            stamina++;
            staminaElement.textContent = `Stamina: ${stamina}`;
            await fetch('/update-stamina', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId, stamina: stamina })
            });
        }
    }

    startButton.addEventListener('click', () => {
        startButton.classList.add('hidden');
        levelSelection.classList.remove('hidden');
    });

    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedLevel = button.dataset.level;
            levelSelection.classList.add('hidden');
            board.classList.remove('hidden');
            createBoard();
            startTimer(); // Start the timer when the game begins
        });
    });

    function createBoard() {
        board.innerHTML = '';
        const cards = [...cardImages[selectedLevel], ...cardImages[selectedLevel]].sort(() => 0.5 - Math.random());

        const gridSize = {
            easy: { cols: 3, rows: 2 },
            normal: { cols: 4, rows: 2 },
            hard: { cols: 4, rows: 3 }
        };

        const { cols, rows } = gridSize[selectedLevel];
        board.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
        board.style.gridTemplateRows = `repeat(${rows}, 100px)`;

        cards.forEach((image) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = image;

            const img = document.createElement('img');
            img.src = image;
            card.appendChild(img);

            card.addEventListener('click', () => flipCard(card));
            board.appendChild(card);
            cardElements.push(card);
        });
    }

    function flipCard(card) {
        if (flippedCards.length === 2 || card.classList.contains('flipped')) return;

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            setTimeout(checkForMatch, 1000);
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const image1 = card1.dataset.image;
        const image2 = card2.dataset.image;

        if (image1 === image2) {
            matchedPairs++;
            if (matchedPairs === cardImages[selectedLevel].length) {
                points += getPointsForLevel(selectedLevel); // Add points only when all pairs are matched
                fetch('/update-points', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: userId, points: points })
                });
                alert('Congratulations! You have matched all pairs.');
                clearInterval(timerInterval); // Stop the timer when game is complete
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }

        flippedCards = [];
    }

    function getPointsForLevel(level) {
        switch (level) {
            case 'easy': return 100;
            case 'normal': return 300;
            case 'hard': return 500;
            default: return 0;
        }
    }

    // Initialize UI and fetch user data
    fetchUsername();
    fetchStamina();
    updateUI();
});
