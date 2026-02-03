// Game state variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

// DOM elements
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

// Winning combinations
const winningConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

// Initialize the game
function initializeGame() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    restartBtn.addEventListener('click', restartGame);
    updateStatus();
}

// Handle cell click
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Check if cell is already taken or game is not active
    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Update game state
    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add('taken');
    clickedCell.classList.add(currentPlayer.toLowerCase());

    // Check for win or draw
    checkResult();
}

// Check game result
function checkResult() {
    let roundWon = false;
    let winningCombination = [];

    // Check all winning conditions
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === '' || board[b] === '' || board[c] === '') {
            continue;
        }
        if (board[a] === board[b] && board[b] === board[c]) {
            roundWon = true;
            winningCombination = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `Player ${currentPlayer} Wins! 🎉`;
        gameActive = false;
        highlightWinningCells(winningCombination);
        return;
    }

    // Check for draw
    const roundDraw = !board.includes('');
    if (roundDraw) {
        statusDisplay.textContent = "It's a Draw! 🤝";
        gameActive = false;
        return;
    }

    // Continue game - switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
}

// Highlight winning cells
function highlightWinningCells(combination) {
    combination.forEach(index => {
        cells[index].classList.add('winner');
    });
}

// Update status display
function updateStatus() {
    if (gameActive) {
        statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

// Restart game
function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'x', 'o', 'winner');
    });
    
    updateStatus();
}

// Start the game when page loads
initializeGame();
