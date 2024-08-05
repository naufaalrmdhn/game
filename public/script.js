document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    let staminaTimer = 120; // 2 minutes
    let userStamina = 0;

    // Fetch user data from backend
    async function fetchUserData() {
        const response = await fetch(`http://localhost:3000/user/${userId}`);
        const user = await response.json();
        document.getElementById('user-id').innerText = userId;
        userStamina = user.stamina;
        document.getElementById('stamina-value').innerText = userStamina;
        document.getElementById('points-value').innerText = user.points;
    }

    // Timer for stamina increase
    setInterval(() => {
        staminaTimer--;
        document.getElementById('timer-value').innerText = staminaTimer;
        if (staminaTimer === 0) {
            staminaTimer = 120;
            increaseStamina();
        }
    }, 1000);

    // Function to increase stamina
    async function increaseStamina() {
        const response = await fetch('http://localhost:3000/increaseStamina', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });
        const result = await response.json();
        if (result.success) {
            userStamina = result.stamina;
            document.getElementById('stamina-value').innerText = userStamina;
        }
    }

    // Start game function
    window.startGame = async (level) => {
        const staminaCost = { easy: 1, normal: 3, hard: 5 }[level];
        if (userStamina >= staminaCost) {
            const response = await fetch('http://localhost:3000/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, level, won: false })
            });

            const result = await response.json();
            if (result.success) {
                userStamina -= staminaCost;
                document.getElementById('stamina-value').innerText = userStamina;
                document.getElementById('level-selection').style.display = 'none';
                document.getElementById('game-board').style.display = 'block';

                // Initialize game board
                let boardSize;
                if (level === 'easy') {
                    boardSize = 2;
                } else if (level === 'normal') {
                    boardSize = 4;
                } else if (level === 'hard') {
                    boardSize = 6;
                }

                const board = document.getElementById('board');
                board.innerHTML = '';
                board.style.gridTemplateColumns = `repeat(${boardSize}, 100px)`;

                // Create shuffled card set
                const cardSet = [];
                for (let i = 1; i <= (boardSize * boardSize) / 2; i++) {
                    cardSet.push(i, i);
                }
                cardSet.sort(() => 0.5 - Math.random());

                // Render cards
                cardSet.forEach(number => {
                    const card = document.createElement('div');
                    card.className = 'card cover';
                    card.innerHTML = `<img src="/images/${level}/card${number}.png" alt="Card ${number}">`;
                    card.addEventListener('click', () => flipCard(card));
                    board.appendChild(card);
                });

                let flippedCards = [];
                function flipCard(card) {
                    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
                        card.classList.add('flipped');
                        card.classList.remove('cover');
                        flippedCards.push(card);

                        if (flippedCards.length === 2) {
                            setTimeout(() => {
                                const [firstCard, secondCard] = flippedCards;
                                if (firstCard.querySelector('img').src === secondCard.querySelector('img').src) {
                                    // Matched
                                    firstCard.classList.add('matched');
                                    secondCard.classList.add('matched');
                                } else {
                                    // Not matched
                                    firstCard.classList.remove('flipped');
                                    firstCard.classList.add('cover');
                                    secondCard.classList.remove('flipped');
                                    secondCard.classList.add('cover');
                                }
                                flippedCards = [];
                            }, 1000);
                        }
                    }
                }
            } else {
                alert('Not enough stamina to play this level.');
            }
        } else {
            alert('Not enough stamina to play this level.');
        }
    };

    fetchUserData();
});
