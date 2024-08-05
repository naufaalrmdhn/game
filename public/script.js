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
    const gameContainer = document.getElementById('game-container');
    const levelButtons = document.querySelectorAll('.level-button');
    const staminaDisplay = document.getElementById('stamina-value');
    const pointsDisplay = document.getElementById('points');
    const timeLeftDisplay = document.getElementById('time-left');

    let cardElements = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let selectedLevel = '';
    let stamina = 10;
    let points = 0;
    let timer;
    let userId = new URLSearchParams(window.location.search).get('userId');

    // Update user info from URL
    document.getElementById('username-value').textContent = userId;

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
            gameContainer.classList.remove('hidden');
            createBoard();
            startTimer();
        });
    });

    // Function to create the game board
    function createBoard() {
        board.innerHTML = '';
        let gridTemplateColumns;
        let gridTemplateRows;
        const cards = [...cardImages[selectedLevel], ...cardImages[selectedLevel]].sort(() => 0.5 - Math.random());

        switch (selectedLevel) {
            case 'easy':
                gridTemplateColumns = 'repeat(3, 100px)'; // 3 columns
                gridTemplateRows = 'repeat(2, 100px)';    // 2 rows
                break;
            case 'normal':
                gridTemplateColumns = 'repeat(4, 100px)'; // 4 columns
                gridTemplateRows = 'repeat(2, 100px)';    // 2 rows
                break;
            case 'hard':
                gridTemplateColumns = 'repeat(4, 100px)'; // 4 columns
                gridTemplateRows = 'repeat(3, 100px)';    // 3 rows
                break;
            default:
                gridTemplateColumns = 'repeat(3, 100px)'; // Default fallback
                gridTemplateRows = 'repeat(3, 100px)';
        }

        board.style.gridTemplateColumns = gridTemplateColumns;
        board.style.gridTemplateRows = gridTemplateRows;

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
            points += selectedLevel === 'easy' ? 100 : selectedLevel === 'normal' ? 300 : 500;
            fetch(`http://localhost:3000/user/${userId}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ points })
            });
            pointsDisplay.textContent = `Points: ${points}`;
            card1.classList.add('matched');
            card2.classList.add('matched');
            if (document.querySelectorAll('.card:not(.matched)').length === 0) {
                clearInterval(timer);
                alert('Congratulations! You have matched all pairs.');
                document.getElementById('level-selection').classList.remove('hidden');
                gameContainer.classList.add('hidden');
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }

        flippedCards = [];
    }

    // Function to start the timer
    function startTimer() {
        let timeLeft = 0;
        timer = setInterval(() => {
            timeLeft++;
            timeLeftDisplay.textContent = timeLeft;
            updateStamina();
        }, 1000);
    }

    // Function to update stamina
    function updateStamina() {
        stamina--;
        if (stamina <= 0) {
            clearInterval(timer);
            alert('Game Over! Your stamina has run out.');
            document.getElementById('level-selection').classList.remove('hidden');
            gameContainer.classList.add('hidden');
        } else {
            fetch(`http://localhost:3000/user/${userId}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stamina })
            });
            staminaDisplay.textContent = stamina;
        }
    }
});
