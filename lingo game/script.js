let words = ["apple", "bread", "chair", "drink", "table"];
let secretWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
let attempts = 0;
const maxAttempts = 5;
const board = document.getElementById("game-board");
const input = document.getElementById("guess-input");
const button = document.getElementById("submit-btn");
const aiButton = document.getElementById("ai-btn");
const resetButton = document.getElementById("reset-btn");
const revealWord = document.getElementById("reveal-word");

let rows = [];
let usedGuesses = [];

function initBoard() {
  board.innerHTML = "";
  rows = [];
  for (let r = 0; r < maxAttempts; r++) {
    const row = [];
    for (let c = 0; c < 5; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      board.appendChild(tile);
      row.push(tile);
    }
    rows.push(row);
  }
}

function checkGuess(guess) {
  const letters = guess.toLowerCase().split("");
  const secret = secretWord.split("");

  for (let i = 0; i < 5; i++) {
    const tile = rows[attempts][i];
    tile.textContent = letters[i];
    tile.classList.remove("green", "yellow", "gray");
    if (letters[i] === secret[i]) {
      tile.classList.add("green");
    } else if (secret.includes(letters[i])) {
      tile.classList.add("yellow");
    } else {
      tile.classList.add("gray");
    }
  }
}

function endGame(success) {
  revealWord.textContent = `The word was: ${secretWord.toUpperCase()}`;
  button.disabled = true;
  aiButton.disabled = true;
}

button.addEventListener("click", () => {
  const guess = input.value.trim();
  if (guess.length !== 5) return alert("Please enter a 5-letter word.");
  if (attempts >= maxAttempts) return;

  checkGuess(guess);
  attempts++;
  input.value = "";

  if (guess.toLowerCase() === secretWord) {
    setTimeout(() => alert("🎉 You guessed it right!"), 200);
    endGame(true);
  } else if (attempts >= maxAttempts) {
    setTimeout(() => alert("😢 Out of tries!"), 200);
    endGame(false);
  }
});

aiButton.addEventListener("click", () => {
  if (attempts >= maxAttempts) return;
  const aiGuess = words.find(w => !usedGuesses.includes(w)) || "apple";
  input.value = aiGuess;
  button.click();
  usedGuesses.push(aiGuess);
});

resetButton.addEventListener("click", () => {
  secretWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
  attempts = 0;
  usedGuesses = [];
  input.value = "";
  revealWord.textContent = "";
  button.disabled = false;
  aiButton.disabled = false;
  initBoard();
});

initBoard();
