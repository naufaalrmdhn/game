// JavaScript untuk logika permainan
const board = document.getElementById('board');
const cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F'];

const createBoard = () => {
    // Shuffling card values
    const shuffledValues = cardValues.sort(() => Math.random() - 0.5);

    // Create cards
    shuffledValues.forEach(value => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.cardValue = value;
        card.addEventListener('click', () => {
            // Logika untuk membuka dan mencocokkan kartu
        });
        board.appendChild(card);
    });
};

createBoard();
