document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('gameContainer');
    const gameBoard = document.getElementById('gameBoard');
    const levelSelection = document.getElementById('levelSelection');
    const result = document.getElementById('result');
    const resultMessage = document.getElementById('resultMessage');
    const playAgainButton = document.getElementById('playAgainButton');
    const staminaValue = document.getElementById('staminaValue');

    let boardSize = { rows: 2, cols: 3 };
    let cards = [];
    let flippedCards = [];
    let selectedLevel = '';
    let userStamina = 10;  // Initialize with default stamina

    async function fetchStamina() {
        try {
            const response = await fetch('/stamina');
            const data = await response.json();
            userStamina = data.stamina;
            staminaValue.textContent = userStamina;
        } catch (error) {
            console.error('Error fetching stamina:', error);
        }
    }

    async function updateStamina(amount) {
        try {
            await fetch('/update-stamina', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount })
            });
            fetchStamina();
        } catch (error) {
            console.error('Error updating stamina:', error);
        }
    }

    function getLevelConfig(level) {
        switch (level) {
            case 'easy':
                boardSize = { rows: 2, cols: 3 };
                break;
            case 'normal':
                boardSize = { rows: 2, cols: 4 };
                break;
            case 'hard':
                boardSize = { rows: 3, cols: 4 };
                break;
        }
        createBoard();
    }

    function createBoard() {
        gameBoard.innerHTML = '';
        cards = [];
        flippedCards = [];
        
        for (let i = 0; i < boardSize.rows * boardSize.cols; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.id = i;
            card.addEventListener('click', () => flipCard(card));
            gameBoard.appendChild(card);
            cards.push(card);
        }
        gameContainer.classList.remove('hidden');
        levelSelection.classList.add('hidden');
    }

    function flipCard(card) {
        if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
            card.classList.add('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                checkMatch();
            }
        }
    }

    function checkMatch() {
        const [firstCard, secondCard] = flippedCards;
        if (firstCard.dataset.id === secondCard.dataset.id) {
            setTimeout(() => {
                flippedCards.forEach(card => card.classList.add('matched'));
                flippedCards = [];
                checkWin();
            }, 500);
        } else {
            setTimeout(() => {
                flippedCards.forEach(card => card.classList.remove('flipped'));
                flippedCards = [];
            }, 1000);
        }
    }

    function checkWin() {
        if (document.querySelectorAll('.card:not(.flipped)').length === 0) {
            endGame(true);
        }
    }

    function endGame(won) {
        result.classList.remove('hidden');
        resultMessage.textContent = won ? 'You won!' : 'You lost!';
        playAgainButton.onclick = () => {
            result.classList.add('hidden');
            gameContainer.classList.add('hidden');
            levelSelection.classList.remove('hidden');
            if (won) {
                const points = getPointsBasedOnLevel(selectedLevel);
                updateStamina(points); // Increase stamina as points
            }
        };
    }

    function getPointsBasedOnLevel(level) {
        switch (level) {
            case 'easy':
                return 100;
            case 'normal':
                return 300;
            case 'hard':
                return 500;
        }
    }

    async function startGame(level) {
        selectedLevel = level;
        await updateStamina(-getLevelCost(level)); // Deduct stamina
        getLevelConfig(level);
    }

    function getLevelCost(level) {
        switch(level) {
            case 'easy':
                return 1;
            case 'normal':
                return 3;
            case 'hard':
                return 5;
        }
    }

    // Initial call to ensure stamina is displayed
    fetchStamina();
});
