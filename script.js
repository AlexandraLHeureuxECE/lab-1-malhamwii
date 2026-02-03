// Game state variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let moveCount = 0;

// Customization settings
let currentTheme = 'purple';
let currentMarks = 'classic';

const markStyles = {
    classic: { X: 'X', O: 'O' },
    emoji: { X: '😎', O: '😊' },
    symbols: { X: '✖', O: '⭕' }
};

// DOM elements
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const winLine = document.getElementById('winLine');
const playerXIndicator = document.getElementById('playerX');
const playerOIndicator = document.getElementById('playerO');
const customizeBtn = document.getElementById('customizeBtn');
const customizeOptions = document.getElementById('customizeOptions');
const themeBtns = document.querySelectorAll('.theme-btn');
const markBtns = document.querySelectorAll('.mark-btn');

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
    
    // Customization event listeners
    customizeBtn.addEventListener('click', toggleCustomization);
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => changeTheme(btn.dataset.theme));
    });
    markBtns.forEach(btn => {
        btn.addEventListener('click', () => changeMarks(btn.dataset.marks));
    });
    
    // Apply saved preferences
    applyTheme(currentTheme);
    applyMarks(currentMarks);
    
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
    clickedCell.textContent = markStyles[currentMarks][currentPlayer];
    clickedCell.classList.add('taken');
    clickedCell.classList.add(currentPlayer.toLowerCase());
    clickedCell.classList.add('placed');
    moveCount++;

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
        statusDisplay.textContent = `🎉 Player ${currentPlayer} Wins! 🎉`;
        statusDisplay.className = 'game-over';
        gameActive = false;
        
        // Highlight winner indicator
        if (currentPlayer === 'X') {
            playerXIndicator.classList.add('winner');
        } else {
            playerOIndicator.classList.add('winner');
        }
        
        highlightWinningCells(winningCombination);
        return;
    }

    // Check for draw
    const roundDraw = !board.includes('');
    if (roundDraw) {
        statusDisplay.textContent = "🤝 It's a Draw! Well played both! 🤝";
        statusDisplay.className = 'game-over';
        gameActive = false;
        playerXIndicator.classList.remove('active');
        playerOIndicator.classList.remove('active');
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
    drawWinningLine(combination);
}

// Draw winning line
function drawWinningLine(combination) {
    const [a, b, c] = combination;
    const boardRect = document.getElementById('board').getBoundingClientRect();
    const cellSize = cells[0].getBoundingClientRect().width;
    const gap = 10; // Match the gap in grid
    
    // Calculate center positions for start and end cells
    const getCellCenter = (index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const x = col * (cellSize + gap) + cellSize / 2;
        const y = row * (cellSize + gap) + cellSize / 2;
        return { x, y };
    };
    
    const start = getCellCenter(a);
    const end = getCellCenter(c);
    
    const line = winLine.querySelector('line');
    line.setAttribute('x1', start.x);
    line.setAttribute('y1', start.y);
    line.setAttribute('x2', end.x);
    line.setAttribute('y2', end.y);
    
    // Trigger animation
    winLine.classList.add('show');
}

// Update status display
function updateStatus() {
    if (gameActive) {
        statusDisplay.className = currentPlayer === 'X' ? 'x-turn' : 'o-turn';
        
        if (moveCount === 0) {
            statusDisplay.textContent = `Player ${currentPlayer}'s Turn - Click any cell to start!`;
        } else if (moveCount < 3) {
            statusDisplay.textContent = `Player ${currentPlayer}'s Turn - Keep playing!`;
        } else {
            statusDisplay.textContent = `Player ${currentPlayer}'s Turn - Make your move!`;
        }
        
        // Update player indicators
        if (currentPlayer === 'X') {
            playerXIndicator.classList.add('active');
            playerOIndicator.classList.remove('active');
        } else {
            playerOIndicator.classList.add('active');
            playerXIndicator.classList.remove('active');
        }
    }
}

// Restart game
function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    moveCount = 0;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'x', 'o', 'winner', 'placed');
    });
    
    // Reset player indicators
    playerXIndicator.classList.remove('winner');
    playerOIndicator.classList.remove('winner');
    playerXIndicator.classList.add('active');
    playerOIndicator.classList.remove('active');
    statusDisplay.className = 'x-turn';
    
    // Reset winning line
    winLine.classList.remove('show');
    const line = winLine.querySelector('line');
    line.setAttribute('x1', '0');
    line.setAttribute('y1', '0');
    line.setAttribute('x2', '0');
    line.setAttribute('y2', '0');
    
    updateStatus();
}

// Start the game when page loads
initializeGame();

// Customization functions
function toggleCustomization() {
    customizeOptions.classList.toggle('show');
}

function changeTheme(theme) {
    currentTheme = theme;
    applyTheme(theme);
    
    // Update active button
    themeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}

function applyTheme(theme) {
    document.body.className = `theme-${theme}`;
}

function changeMarks(marks) {
    currentMarks = marks;
    applyMarks(marks);
    
    // Update active button
    markBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.marks === marks);
    });
    
    // Update existing marks on board
    cells.forEach((cell, index) => {
        if (board[index] !== '') {
            cell.textContent = markStyles[marks][board[index]];
        }
    });
    
    // Update player indicators
    updatePlayerIndicators();
}

function applyMarks(marks) {
    document.body.classList.remove('marks-classic', 'marks-emoji', 'marks-symbols');
    document.body.classList.add(`marks-${marks}`);
}

function updatePlayerIndicators() {
    const playerXSymbol = playerXIndicator.querySelector('.player-symbol');
    const playerOSymbol = playerOIndicator.querySelector('.player-symbol');
    playerXSymbol.textContent = markStyles[currentMarks].X;
    playerOSymbol.textContent = markStyles[currentMarks].O;
}
