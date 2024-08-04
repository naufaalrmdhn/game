document.addEventListener('DOMContentLoaded', () => {
    const cardImages = [
        'images/easy/card1.png',
        'images/easy/card2.png',
        'images/easy/card3.png'
    ];

    const board = document.getElementById('game-board');
    const startButton = document.getElementById('start-button');
    let cardElements = [];
    let flippedCards = [];
    let matchedPairs = 0;

    // Function to create the game board
    function createBoard() {
        board.innerHTML = '';
        const cards = [...cardImages, ...cardImages].sort(() => 0.5 - Math.random());

        cards.forEach((image, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = image;

            const img = document.createElement('img');
            img.src = image;
            card.appendChild(img);

            card.addEventListener('click', () => flipCard(card));
            board.appendChild(card);
            cardElements.push(card);
        });
    }

    // Function to flip a card
    function flipCard(card) {
        if (flippedCards.length === 2 || card.classList.contains('flipped')) return;

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            setTimeout(checkForMatch, 1000);
        }
    }

    // Function to check if two flipped cards match
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const image1 = card1.dataset.image;
        const image2 = card2.dataset.image;

        if (image1 === image2) {
            matchedPairs++;
            if (matchedPairs === cardImages.length) {
                alert('Congratulations! You have matched all pairs.');
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }

        flippedCards = [];
    }

    // Event listener for the start button
    startButton.addEventListener('click', () => {
        createBoard();
    });
});
