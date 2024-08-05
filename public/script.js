document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    let userStamina = 10; // Stamina awal
    let points = 0;
    let staminaTimer = 0; // Timer stamina
    let countdown = 120; // 2 menit untuk stamina
    let interval;

    // Fetch user data from backend
    async function fetchUserData() {
        const response = await fetch(`http://localhost:3000/user/${userId}`);
        const user = await response.json();
        userStamina = user.stamina;
        points = user.points;
        document.getElementById('user-id').innerText = userId;
        document.getElementById('stamina-value').innerText = userStamina;
        document.getElementById('points-value').innerText = points;

        // Set up timer for stamina increase
        setupStaminaTimer();
    }

    // Set up stamina timer
    function setupStaminaTimer() {
        countdown = 120;
        clearInterval(interval);
        interval = setInterval(() => {
            countdown--;
            document.getElementById('timer-value').innerText = countdown;
            if (countdown <= 0) {
                increaseStamina();
                countdown = 120; // Reset countdown
            }
        }, 1000);
    }

    // Function to increase stamina
    async function increaseStamina() {
        const response = await fetch(`http://localhost:3000/increaseStamina`, {
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
            userStamina -= staminaCost;
            document.getElementById('stamina-value').innerText = userStamina;
            document.getElementById('level-selection').style.display = 'none';
            document.getElementById('game-board').style.display = 'block';

            // Initialize game board for Easy level (2x3)
            const board = document.getElementById('board');
            board.innerHTML = '';
            board.style.gridTemplateColumns = 'repeat(3, 100px)';

            const cardSet = [];
            for (let i = 1; i <= 3; i++) {
                cardSet.push(i, i); // Duplikat gambar
            }
            cardSet.sort(() => 0.5 - Math.random());

            cardSet.forEach(number => {
                const card = document.createElement('div');
                card.className = 'card cover';
                card.innerHTML = `<img src="/images/easy/card${number}.png" alt="Card ${number}">`;
                card.addEventListener('click', () => flipCard(card));
                board.appendChild(card);
            });

            let flippedCards = [];
            function flipCard(card) {
                if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
                    card.classList.remove('cover');
                    card.classList.add('flipped');
                    flippedCards.push(card);
                    card.querySelector('img').style.display = 'block';

                    if (flippedCards.length === 2) {
                        setTimeout(() => {
                            const [firstCard, secondCard] = flippedCards;
                            if (firstCard.querySelector('img').src === secondCard.querySelector('img').src) {
                                // Matched
                                firstCard.classList.add('matched');
                                secondCard.classList.add('matched');
                                points += 100; // Tambah poin jika menang
                                document.getElementById('points-value').innerText = points;
                                // Send result to backend
                                fetch('http://localhost:3000/updateUser', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ userId, level, won: true })
                                });
                            } else {
                                // Not matched
                                firstCard.classList.add('cover');
                                secondCard.classList.add('cover');
                                firstCard.querySelector('img').style.display = 'none';
                                secondCard.querySelector('img').style.display = 'none';
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
