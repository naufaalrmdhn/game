document.addEventListener('DOMContentLoaded', () => {
    // Get level from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('level');
    let rows, cols;

    // Set game board dimensions based on level
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

    createGameBoard(rows, cols);
});

function createGameBoard(rows, cols) {
    const container = document.getElementById('game-container');
    container.innerHTML = ''; // Clear existing content

    const board = document.createElement('div');
    board.className = 'game-board';

    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.className = 'game-cell';
        board.appendChild(cell);
    }

    container.appendChild(board);
}
