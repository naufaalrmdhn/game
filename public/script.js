const userId = 1; // Simulasi user ID, ganti dengan ID pengguna yang sebenarnya

const fetchUserData = async () => {
    try {
        const response = await fetch(`http://localhost:3000/user/${userId}`);
        const data = await response.json();
        document.getElementById('stamina').textContent = `Stamina: ${data.stamina}`;
        document.getElementById('points').textContent = `Points: ${data.points}`;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

const updateUserData = async (level, won) => {
    try {
        await fetch('http://localhost:3000/updateUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, stamina: user.stamina, points: user.points }),
        });
    } catch (error) {
        console.error('Error updating user data:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    fetchUserData();

    document.getElementById('easy').addEventListener('click', () => {
        startGame('easy');
    });

    document.getElementById('normal').addEventListener('click', () => {
        startGame('normal');
    });

    document.getElementById('hard').addEventListener('click', () => {
        startGame('hard');
    });
});

const startGame = async (level) => {
    document.getElementById('level-selection').style.display = 'none';
    document.getElementById('game-board').style.display = 'block';

    // Generate game board based on level
    const size = getBoardSize(level);
    generateBoard(size);

    // Add game logic here, e.g., matching cards
};

const getBoardSize = (level) => {
    if (level === 'easy') return { rows: 2, cols: 3 };
    if (level === 'normal') return { rows: 2, cols: 4 };
    if (level === 'hard') return { rows: 3, cols: 4 };
};

const generateBoard = (size) => {
    const board = document.getElementById('game-board');
    board.innerHTML = '';

    for (let i = 0; i < size.rows * size.cols; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.cardId = i;
        card.innerText = '🔲'; // Placeholder, replace with actual image later
        board.appendChild(card);

        card.addEventListener('click', () => {
            // Handle card click
        });
    }
};
