document.addEventListener('DOMContentLoaded', () => {
    const levelButtons = document.querySelectorAll('#level-selection button');
    const gameBoard = document.getElementById('game-board');
    const board = document.getElementById('board');
    const staminaValue = document.getElementById('stamina-value');
    const userId = 'your-telegram-user-id'; // Anda perlu mendapatkan ID pengguna dari bot Telegram

    async function fetchStamina() {
        const response = await fetch(`http://localhost:3000/stamina?userId=${userId}`);
        const data = await response.json();
        staminaValue.textContent = data.stamina;
        return data.stamina;
    }

    async function updateStamina(staminaCost) {
        const response = await fetch('http://localhost:3000/update-stamina', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, staminaCost })
        });
        const data = await response.json();
        updateStaminaDisplay(data.stamina);
    }

    function updateStaminaDisplay(stamina) {
        staminaValue.textContent = stamina;
    }

    levelButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const level = button.id;
            const stamina = await fetchStamina();

            let staminaCost = 1;
            if (level === 'normal') staminaCost = 3;
            if (level === 'hard') staminaCost = 5;

            if (stamina < staminaCost) {
                alert('Sorry, you do not have enough stamina to play this level.');
                return;
            }

            await updateStamina(staminaCost);
            startGame(level);
        });
    });

    function startGame(level) {
        gameBoard.style.display = 'block';
        board.innerHTML = '';
        let rows, cols;

        switch (level) {
            case 'easy':
                rows = 2;
                cols = 3;
                break;
            case 'normal':
                rows = 2;
                cols = 4;
                break;
            case 'hard':
                rows = 3;
                cols = 4;
                break;
        }

        board.style.gridTemplateRows = `repeat(${rows}, 60px)`;
        board.style.gridTemplateColumns = `repeat(${cols}, 60px)`;

        const totalTiles = rows * cols;
        for (let i = 0; i < totalTiles; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            board.appendChild(tile);
        }
    }
});
