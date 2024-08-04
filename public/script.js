document.addEventListener('DOMContentLoaded', () => {
    const levelSelection = document.getElementById('level-selection');
    const gameBoard = document.getElementById('game-board');
    const result = document.getElementById('result');
    const resultMessage = document.getElementById('result-message');
    const playAgainButton = document.getElementById('play-again');
    const staminaDisplay = document.getElementById('stamina-display');

    let selectedLevel = '';
    let stamina = 10; // Initial stamina
    let images = []; // To store images for the game
    let selectedCards = [];
    let matchedPairs = 0;

    function loadImages(level) {
        images = [];
        const levelDir = level === 'easy' ? 'easy' : level === 'normal' ? 'normal' : 'hard';
        const totalImages = level === 'easy' ? 3 : level === 'normal' ? 6 : 12;

        for (let i = 1; i <= totalImages; i++) {
            images.push(`images/${levelDir}/card${i}.png`);
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function generateGameBoard(level) {
        let rows, cols;
        let imageCount;

        if (level === 'easy') {
            rows = 2;
            cols = 3;
            imageCount = 3;
        } else if (level === 'normal') {
            rows = 2;
            cols = 4;
            imageCount = 6;
        } else if (level === 'hard') {
            rows = 3;
            cols = 4;
            imageCount = 12;
        }

        loadImages(level);
        images = shuffleArray([...images, ...images]); // Duplicate images for matching pairs

        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
        gameBoard.style.gridTemplateRows = `repeat(${rows}, 100px)`;

        for (let i = 0; i < rows * cols; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.style.width = '100px';
            card.style.height = '100px';
            card.style.backgroundImage = `url('images/hidden.png')`; // Placeholder image
            card.style.backgroundSize = 'cover';
            card.dataset.image = images[i];
            card.dataset.index = i;
            card.addEventListener('click', () => {
                flipCard(card);
            });
            gameBoard.appendChild(card);
        }
        gameBoard.classList.remove('hidden');
    }

    function flipCard(card) {
        if (selectedCards.length < 2 && !card.classList.contains('flipped')) {
            card.style.backgroundImage = `url('${card.dataset.image}')`;
            card.classList.add('flipped');
            selectedCards.push(card);

            if (selectedCards.length === 2) {
                setTimeout(checkMatch, 1000);
            }
        }
    }

    function checkMatch() {
        const [card1, card2] = selectedCards;
        if (card1.dataset.image === card2.dataset.image) {
            card1.removeEventListener('click', () => flipCard(card1));
            card2.removeEventListener('click', () => flipCard(card2));
            matchedPairs++;
            if (matchedPairs === images.length / 2) {
                endGame(true);
            }
        } else {
            card1.style.backgroundImage = `url('images/hidden.png')`;
            card2.style.backgroundImage = `url('images/hidden.png')`;
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }
        selectedCards = [];
    }

    function handleLevelSelection(level) {
        selectedLevel = level;
        levelSelection.classList.add('hidden');
        generateGameBoard(level);
    }

    function endGame(win) {
        result.classList.remove('hidden');
        resultMessage.textContent = win ? 'You Win!' : 'You Lose!';
        stamina += win ? getLevelStaminaCost(selectedLevel) : -getLevelStaminaCost(selectedLevel);
        updateStamina();
    }

    function getLevelStaminaCost(level) {
        return level === 'easy' ? 1 : level === 'normal' ? 3 : 5;
    }

    document.getElementById('easy').addEventListener('click', () => handleLevelSelection('easy'));
    document.getElementById('normal').addEventListener('click', () => handleLevelSelection('normal'));
    document.getElementById('hard').addEventListener('click', () => handleLevelSelection('hard'));

    playAgainButton.addEventListener('click', () => {
        result.classList.add('hidden');
        levelSelection.classList.remove('hidden');
        stamina = 10; // Reset stamina or fetch from server
        updateStamina();
    });

    async function updateStamina() {
        try {
            const response = await fetch('/stamina');
            const data = await response.json();
            stamina = data.stamina;
            staminaDisplay.textContent = `Stamina: ${stamina}`;
        } catch (error) {
            console.error('Error fetching stamina:', error);
        }
    }

    updateStamina();
});
