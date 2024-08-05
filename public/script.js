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
    const staminaDisplay = document.getElementById('stamina-value');
    const pointsDisplay = document.getElementById('points-value');
    const timerDisplay = document.getElementById('timer-value');
    const usernameDisplay = document.getElementById('username-value');
    
    let cardElements = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let selectedLevel = '';
    let userId = new URLSearchParams(window.location.search).get('userId');
    let stamina = 10;
    let points = 0;
    let timer = 0;
    let timerInterval;
    
    // Fetch user data
    fetch(`http://localhost:3000/user/${userId}`)
        .then(response => response.json())
        .then(data => {
            points = data.points || 0;
            stamina = data.stamina || 10;
            usernameDisplay.textContent = `User ${userId}`;
            pointsDisplay.textContent = points;
            staminaDisplay.textContent = stamina;
            startTimer();
        });

    function startTimer() {
        timerInterval = setInterval(() => {
            timer++;
            timerDisplay.textContent = timer;
            if (timer % 120 === 0) { // Every 2 minutes
                stamina++;
                staminaDisplay.textContent = stamina;
            }
        }, 1000);
    }

    // Show level selection when start button is clicked
    startButton.addEventListener('click', () => {
        startButton.classList.add('hidden');
        levelSelection.classList.remove('hidden');
    });

    // Handle level selection
    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedLevel = button.dataset.level;
            levelSelection.classList.add('hidden');
            board.classList.remove('hidden');
            createBoard();
        });
    });

    // Function to create the game board
    function createBoard() {
        board.innerHTML = '';
        const cards = [...cardImages[selectedLevel], ...cardImages[selectedLevel]].sort(() => 0.5 - Math.random());

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

    // Function to flip a card
    function flipCard(card) {
        if (flippedCards.length === 2 || card.classList.contains('flipped')) return;

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            setTimeout(checkForMatch, 1000);
        }
    }

    // Function to check if two flipped cards match
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const image1 = card1.dataset.image;
        const image2 = card2.dataset.image;

        if (image1 === image2) {
            matchedPairs++;
            points += getPointsForLevel(selectedLevel);
            pointsDisplay.textContent = points;
            updateUserData();
            if (matchedPairs === cardImages[selectedLevel].length) {
                alert('Congratulations! You have matched all pairs.');
                levelSelection.classList.remove('hidden');
                board.classList.add('hidden');
                resetGame();
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }

        flippedCards = [];
    }

    function getPointsForLevel(level) {
        switch (level) {
            case 'easy':
                return 100;
            case 'normal':
                return 300;
            case 'hard':
                return 500;
            default:
                return 0;
        }
    }

    function updateUserData() {
        fetch(`http://localhost:3000/user/${userId}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ points, stamina }),
        });
    }

    function resetGame() {
        cardElements = [];
        flippedCards = [];
        matchedPairs = 0;
        stamina--; // Deduct stamina after game is over
        staminaDisplay.textContent = stamina;
        updateUserData();
    }
});
