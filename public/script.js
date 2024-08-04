document.addEventListener('DOMContentLoaded', () => {
    const levelSelection = document.getElementById('level-selection');
    const gameContainer = document.getElementById('game-container');
    const gameBoard = document.getElementById('game-board');
    const staminaDisplay = document.getElementById('stamina-display');
    const result = document.getElementById('result');
    const resultMessage = document.getElementById('result-message');
    const playAgainButton = document.getElementById('play-again');
    let stamina = 10;
    let selectedLevel;
    let boardSize;
    let cards = [];
    let flippedCards = [];
    
    async function updateStamina() {
        try {
            const response = await fetch('/stamina?userId=1'); // Use your user ID
            const data = await response.json();
            stamina = data.stamina;
            staminaDisplay.textContent = `Stamina: ${stamina}`;
        } catch (error) {
            console.error('Error fetching stamina:', error);
        }
    }

    async function decreaseStamina(cost) {
        if (stamina >= cost) {
            try {
                const response = await fetch('/stamina/decrease', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: 1, cost }),
                });
                const data = await response.json();
                stamina = data.stamina;
                staminaDisplay.textContent = `Stamina: ${stamina}`;
            } catch (error) {
                console.error('Error decreasing stamina:', error);
            }
        } else {
            alert('Not enough stamina!');
        }
    }

    async function increaseStamina() {
        try {
            const response = await fetch('/stamina/increase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 1 }),
            });
            const data = await response.json();
            stamina = data.stamina;
            staminaDisplay.textContent = `Stamina: ${stamina}`;
        } catch (error) {
            console.error('Error increasing stamina:', error);
        }
    }

    function getLevelConfig(level) {
        switch(level) {
            case 'easy':
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
                // Optional: Add points to user here based on level
            };
        }
    
        async function startGame(level) {
            selectedLevel = level;
            await updateStamina();
            await decreaseStamina(getLevelCost(level));
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
        updateStamina();
    });
    