const board = document.getElementById('board');
const startButton = document.getElementById('start-button');
const loadingScreen = document.getElementById('loading');
const gameContainer = document.getElementById('game-container');

// Menampilkan loading screen dan menyembunyikannya setelah 1 detik
window.onload = () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
    }, 1000); // Ubah durasi sesuai kebutuhan
};

// Fungsi untuk memulai permainan
const startGame = () => {
    gameContainer.classList.remove('hidden');
    startButton.classList.add('hidden');
    createBoard();
};

// Menambahkan event listener ke tombol start
startButton.addEventListener('click', startGame);

// Fungsi untuk membuat papan permainan
const createBoard = () => {
    const cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F'];
    const shuffledValues = cardValues.sort(() => Math.random() - 0.5);

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
