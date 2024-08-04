document.addEventListener('DOMContentLoaded', () => {
    const levelSelection = document.getElementById('level-selection');
    const gameBoard = document.getElementById('game-board');
    const result = document.getElementById('result');
    const resultMessage = document.getElementById('result-message');
    const playAgainButton = document.getElementById('play-again');
    
    let selectedLevel = '';
    let stamina = 10; // Initial stamina
    
    function generateGameBoard(level) {
        let rows, cols;
        if (level === 'easy') {
            rows = 2;
            cols = 3;
        } else if (level === 'normal') {
            rows = 2;
            cols = 4;
        } else if (level === 'hard') {
            rows = 3;
            cols = 4;
        }

        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
        gameBoard.style.gridTemplateRows = `repeat(${rows}, 100px)`;

        for (let i = 0; i < rows * cols; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.style.backgroundColor = '#ccc';
            card.style.width = '100px';
            card.style.height = '100px';
            card.style.border = '1px solid #333';
            card.addEventListener('click', () => {
                // Add game logic here
            });
            gameBoard.appendChild(card);
        }
        gameBoard.classList.remove('hidden');
    }

    function handleLevelSelection(level) {
        selectedLevel = level;
        levelSelection.classList.add('hidden');
        generateGameBoard(level);
    }

    document.getElementById('easy').addEventListener('click', () => handleLevelSelection('easy'));
    document.getElementById('normal').addEventListener('click', () => handleLevelSelection('normal'));
    document.getElementById('hard').addEventListener('click', () => handleLevelSelection('hard'));

    playAgainButton.addEventListener('click', () => {
        result.classList.add('hidden');
        levelSelection.classList.remove('hidden');
        stamina = 10; // Reset stamina or fetch from server
    });

    // Add function to check result and update stamina
});
