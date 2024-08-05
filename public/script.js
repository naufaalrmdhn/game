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
    const userId = new URLSearchParams(window.location.search).get('userId');
    let cardElements = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let selectedLevel = '';
    let userStamina = 10;
    let points = 0;
    let interval;
    const timerElement = document.getElementById('timer-value');
    const staminaElement = document.getElementById('stamina-value');
    const pointsElement = document.getElementById('points-value');

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
            updatePoints();
            staminaElement.innerText = userStamina;
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
                gridTemplateRows = 'repeat(3, 100px)';    // 3 rows
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
            card.classList.add('cover');
            card.dataset.image = image;

            const img = document.createElement('img');
            img.src = image;
            card.appendChild(img);

            card.addEventListener('click', () => flipCard(card));
            board.appendChild(card);
            cardElements.push(card);
        });

        matchedPairs = 0;
    }

    // Function to flip a card
    function flipCard(card) {
        if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched') || userStamina <= 0) return;

        card.classList.remove('cover');
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
            card1.classList.add('matched');
            card2.classList.add('matched');
            points += { easy: 100, normal: 300, hard: 500 }[selectedLevel];
            fetch(`http://localhost:3000/updateUser`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, points })
            });
            if (matchedPairs === cardImages[selectedLevel].length) {
                setTimeout(() => alert('Congratulations! You have matched all pairs.'), 100);
                levelSelection.classList.remove('hidden');
                board.classList.add('hidden');
            }
        } else {
            card1.classList.add('cover');
            card2.classList.add('cover');
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }

        flippedCards = [];
        userStamina -= { easy: 1, normal: 3, hard: 5 }[selectedLevel];
        staminaElement.innerText = userStamina;
    }

    // Function to update points
    function updatePoints() {
        pointsElement.innerText = points;
    }

    // Setup stamina
    function setupStaminaTimer() {
        let countdown = 120;
        interval = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                increaseStamina();
                countdown = 120; // Reset countdown
            }
        }, 1000);
    }

    // Function to increase stamina
    async function increaseStamina() {
        userStamina++;
        staminaElement.innerText = userStamina;
        await fetch('http://localhost:3000/increaseStamina', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
    }

    // Initialize
    fetchUserData();
    setupStaminaTimer();

    async function fetchUserData() {
        try {
            const response = await fetch(`http://localhost:3000/getUserData?userId=${userId}`);
            const data = await response.json();
            userStamina = data.stamina || 10; // Default to 10 if stamina is not defined
            points = data.points || 0; // Default to 0 if points are not defined
            staminaElement.innerText = userStamina;
            updatePoints();
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
});
