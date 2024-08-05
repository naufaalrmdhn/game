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
    let cardElements = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let selectedLevel = '';
    let userId = new URLSearchParams(window.location.search).get('userId');
    if (!userId) {
        userId = localStorage.getItem('userId') || 'unknown';
    } else {
        localStorage.setItem('userId', userId);
    }
    let points = 0;
    let stamina = 10;
    let levelPoints = { easy: 100, normal: 300, hard: 500 };

    // Fetch username and update UI
    async function fetchUsername() {
        const response = await fetch('/get-username', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId })
        });
        const data = await response.json();
        usernameElement.textContent = `UserID: ${userId}`;
    }

    // Fetch and display stamina
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

    // Fetch and display points
    async function fetchPoints() {
        const response = await fetch('/get-points', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId })
        });
        const data = await response.json();
        points = data.points || 0;
        pointsElement.textContent = `Points: ${points}`;
    }

    // Update stamina in the backend
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

    // Update points in the backend
    async function updatePoints() {
        await fetch('/update-points', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId, points: points })
        });
        pointsElement.textContent = `Points: ${points}`; // Update points UI
    }

    // Initialize the UI and fetch data
    function initialize() {
        fetchUsername();
        fetchStamina();
        fetchPoints();
        setInterval(updateStamina, 60000); // Update stamina every 1 minute
    }

    function updateUI() {
        pointsElement.textContent = `Points: ${points}`;
        staminaElement.textContent = `Stamina: ${stamina}`;
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

            const cover = document.createElement('div');
            cover.classList.add('cover');
            card.appendChild(cover);

            const img = document.createElement('img');
            img.src = image;
            card.appendChild(img);

            card.addEventListener('click', () => flipCard(card));
            board.appendChild(card);
            cardElements.push(card);
        });

        // Adjust grid layout based on selected level
        switch (selectedLevel) {
            case 'easy':
                board.style.gridTemplateColumns = 'repeat(3, 80px)';
                break;
            case 'normal':
                board.style.gridTemplateColumns = 'repeat(4, 80px)';
                break;
            case 'hard':
                board.style.gridTemplateColumns = 'repeat(6, 80px)';
                break;
        }
    }

    // Function to flip a card
    function flipCard(card) {
        if (flippedCards.length === 2 || card.classList.contains('flipped')) return;

        card.classList.add('flipped');
        card.querySelector('.cover').style.display = 'none'; // Hide cover when flipped
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
            if (matchedPairs === cardImages[selectedLevel].length) {
                points += levelPoints[selectedLevel];
                updatePoints(); // Update points in backend and UI
                alert('Congratulations! You have matched all pairs.');
                resetGame();
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.querySelector('.cover').style.display = 'block'; // Show cover for unmatched cards
            card2.querySelector('.cover').style.display = 'block'; // Show cover for unmatched cards
        }

        flippedCards = [];
    }

    // Function to reset the game
    function resetGame() {
        matchedPairs = 0;
        cardElements.forEach(card => card.classList.remove('flipped'));
        cardElements.forEach(card => card.querySelector('.cover').style.display = 'block'); // Show covers
        cardElements = [];
        board.innerHTML = '';
        board.classList.add('hidden');
        startButton.classList.remove('hidden');
    }

    initialize(); // Initialize everything when DOM is loaded
});
