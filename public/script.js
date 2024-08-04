document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('level');
    const userId = urlParams.get('userId');

    if (!level || !userId) {
        document.getElementById('status').innerText = 'Invalid game parameters.';
        return;
    }

    fetch(`http://localhost:3000/user/${userId}`)
        .then(response => response.json())
        .then(user => {
            if (user.stamina <= 0) {
                document.getElementById('status').innerText = 'You have no stamina left.';
                return;
            }

            initializeGameBoard(level);
            document.getElementById('restart-button').style.display = 'none';

            let firstCard = null;
            let lockBoard = false;
            let matchCount = 0;
            const cardValues = generateCardValues(level);

            document.querySelectorAll('.game-cell').forEach(cell => {
                cell.addEventListener('click', () => handleCardClick(cell));
            });

            function handleCardClick(card) {
                if (lockBoard || card.classList.contains('matched') || card === firstCard) return;

                card.textContent = card.dataset.value;
                card.classList.add('flipped');

                if (!firstCard) {
                    firstCard = card;
                    return;
                }

                lockBoard = true;
                setTimeout(() => {
                    checkForMatch(card);
                }, 1000);
            }

            function checkForMatch(secondCard) {
                if (firstCard.dataset.value === secondCard.dataset.value) {
                    firstCard.classList.add('matched');
                    secondCard.classList.add('matched');
                    matchCount += 2;
                    if (matchCount === document.querySelectorAll('.game-cell').length) {
                        document.getElementById('status').innerText = 'You won!';
                        document.getElementById('restart-button').style.display = 'block';
                        updateUser(userId, level, true);
                    }
                } else {
                    firstCard.textContent = '';
                    secondCard.textContent = '';
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                }
                firstCard = null;
                lockBoard = false;
            }

            function generateCardValues(level) {
                const values = [];
                const totalCards = getTotalCards(level);
                for (let i = 0; i < totalCards / 2; i++) {
                    values.push(i + 1, i + 1);
                }
                return shuffle(values);
            }

            function getTotalCards(level) {
                const boardDimensions = {
                    easy: 6,
                    normal: 8,
                    hard: 12
                };
                return boardDimensions[level] || 6;
            }

            function shuffle(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            function updateUser(userId, level, won) {
                fetch(`http://localhost:3000/updateUser`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, level, won })
                }).then(response => response.json())
                  .then(data => console.log('User updated:', data))
                  .catch(err => console.error('Error updating user:', err));
            }

            document.getElementById('restart-button').addEventListener('click', () => {
                window.location.href = `${FRONTEND_URL}`;
            });
        })
        .catch(err => {
            document.getElementById('status').innerText = 'Error fetching user data.';
            console.error(err);
        });
});
