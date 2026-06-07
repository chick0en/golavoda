const game = {
    // secret words that can be answers
    solutionWords: ["APPLE", "HOUSE", "TRAIN"],

    // valid guess words but not answers
    validGuessWords: ["APPLE", "HOUSE", "TRAIN", "PLANE", "CRANE", "SLATE", "BRICK"]
};

let secretWord;

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

let currentRow = 0;
let currentCol = 0;
let gameOver = false;

let hintUsed = false;

const attemptsDisplay =
    document.getElementById("attemptsLeft");

const hintBtn =
    document.getElementById("hintBtn");

// board
const board = document.getElementById("board");

function createBoard() {
    board.innerHTML = "";

    for (let r = 0; r < MAX_GUESSES; r++) {
        const row = document.createElement("div");
        row.classList.add("row");

        for (let c = 0; c < WORD_LENGTH; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            row.appendChild(cell);
        }

        board.appendChild(row);
    }
}

// new game button
const restartBtn = document.createElement("button");
restartBtn.textContent = "New Game";
restartBtn.style.display = "none";
restartBtn.onclick = startGame;
document.body.appendChild(restartBtn);

// start of game
function startGame() {
    secretWord =
        game.solutionWords[Math.floor(Math.random() * game.solutionWords.length)];

    currentRow = 0;
    currentCol = 0;
    gameOver = false;
    hintUsed = false;

attemptsDisplay.textContent = MAX_GUESSES;

hintBtn.disabled = false;

    restartBtn.style.display = "none";

    createBoard();
}

startGame();

hintBtn.addEventListener("click", () => {

    if (gameOver) return;

    if (hintUsed) {
        alert("Hint already used.");
        return;
    }

    alert(
        "The first letter is: " +
        secretWord[0]
    );

    hintUsed = true;
});


function getCell(row, col) {
    return board.children[row].children[col];
}

function showEndButton() {
    restartBtn.style.display = "inline-block";
}

// input
document.addEventListener("keydown", (e) => {
    if (gameOver) return;

    const key = e.key;

    if (/^[a-zA-Z]$/.test(key)) {
        if (currentCol < WORD_LENGTH) {
            getCell(currentRow, currentCol).textContent = key.toUpperCase();
            currentCol++;
        }
    }

    else if (key === "Backspace") {
        if (currentCol > 0) {
            currentCol--;
            getCell(currentRow, currentCol).textContent = "";
        }
    }

    else if (key === "Enter") {
        if (currentCol !== WORD_LENGTH) return;

        let guess = "";
        for (let i = 0; i < WORD_LENGTH; i++) {
            guess += getCell(currentRow, i).textContent;
        }

        // validation
        if (!game.validGuessWords.includes(guess)) {
            alert("Not a valid word");
            return;
        }

        evaluateGuess(guess);
    }
});

// duplicate-safe wordle logic 
function evaluateGuess(guess) {

    const secretArr = secretWord.split("");
    const guessArr = guess.split("");

    const secretUsed = Array(WORD_LENGTH).fill(false);

    // 1st pass: greens
    for (let i = 0; i < WORD_LENGTH; i++) {
        const cell = getCell(currentRow, i);

        if (guessArr[i] === secretArr[i]) {
            cell.classList.add("green");
            secretUsed[i] = true;
            guessArr[i] = null;
        }
    }

    // 2nd pass: yellows + reds
    for (let i = 0; i < WORD_LENGTH; i++) {
        const cell = getCell(currentRow, i);

        if (!cell.classList.contains("green")) {

            let foundIndex = secretArr.findIndex((ch, idx) =>
                ch === guessArr[i] && !secretUsed[idx]
            );

            if (foundIndex !== -1) {
                cell.classList.add("yellow");
                secretUsed[foundIndex] = true;
            } else {
                cell.classList.add("red");
            }
        }
    }

    // when win
    if (guess === secretWord) {
    gameOver = true;

    hintBtn.disabled = true;

    setTimeout(() => alert("You won!"), 100);
    showEndButton();
    return;
}

    currentRow++;
    currentCol = 0;
    attemptsDisplay.textContent =
    MAX_GUESSES - currentRow;

    // when lose
    if (currentRow === MAX_GUESSES) {
    gameOver = true;

    hintBtn.disabled = true;

    setTimeout(() =>
        alert("Game over! Word was: " + secretWord),
    100);

    showEndButton();
}
}
    margin-left: 10px;
}
