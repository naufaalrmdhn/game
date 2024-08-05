document.addEventListener('DOMContentLoaded', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    // Fetch user data from backend
    async function fetchUserData() {
        const response = await fetch(`http://localhost:3000/user/${userId}`);
        const user = await response.json();
        document.getElementById('stamina-value').innerText = user.stamina;
        document.getElementById('points-value').innerText = user.points;
    }

    // Start game function
    window.startGame = async (level) => {
        const response = await fetch('http://localhost:3000/updateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, level, won: false })
        });

        const result = await response.json();
        if (result.success) {
            document.getElementById('level-selection').style.display = 'none';
            document.getElementById('game-board').style.display = 'block';

            // Initialize game board
            let boardSize;
            if (level === 'easy') {
                boardSize = 3;
            } else if (level === 'normal') {
                boardSize = 4;
            } else if (level === 'hard') {
                boardSize = 5;
            }

            const board = document.getElementById('board');
            board.innerHTML = '';
            board.style.gridTemplateColumns = `repeat(${boardSize}, 100px)`;

            for (let i = 0; i < boardSize * boardSize; i++) {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerText = '?';
                board.appendChild(card);
            }
        } else {
            alert('Not enough stamina to play this level.');
        }
    };

    fetchUserData();
});
