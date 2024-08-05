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
                boardSize = 2; // Grid is 2x4 for normal
            } else if (level === 'hard') {
                boardSize = 4;
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
                card.className = 'card';
                card.innerHTML = `<img src="/images/${level}/card${number}.png" alt="Card ${number}">`;
                card.addEventListener('click', () => flipCard(card));
                board.appendChild(card);
            });

            let flippedCards = [];
            function flipCard(card) {
                if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
                    card.classList.add('flipped');
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
                                secondCard.classList.remove('flipped');
                            }
                            flippedCards = [];
                        }, 1000);
                    }
                }
            }
        } else {
            alert('Not enough stamina to play this level.');
        }
    };

    fetchUserData();
});
