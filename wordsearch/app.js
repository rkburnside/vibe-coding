const DEFAULT_WORDS = ["CHROME", "PUZZLE", "SEARCH", "GRID", "DRAG", "MOUSE", "TOUCH", "FRAME"];
const MAX_WORDS = 30;
const boardElement = document.getElementById("board");
const wordListElement = document.getElementById("wordList");
const statusTextElement = document.getElementById("statusText");
const celebrationCardElement = document.getElementById("celebrationCard");
const restartButton = document.getElementById("restartButton");
const editSetupButton = document.getElementById("editSetupButton");
const timerTextElement = document.getElementById("timerText");
const setupScreenElement = document.getElementById("setupScreen");
const gameScreenElement = document.getElementById("gameScreen");
const setupFormElement = document.getElementById("setupForm");
const wordsInputElement = document.getElementById("wordsInput");
const boardSizeSelectElement = document.getElementById("boardSizeSelect");
const minimumSizeTextElement = document.getElementById("minimumSizeText");
const wordCountTextElement = document.getElementById("wordCountText");
const sizeHintTextElement = document.getElementById("sizeHintText");
const setupErrorElement = document.getElementById("setupError");

let gameState = null;
let timerIntervalId = null;
let currentConfig = null;

function buildPuzzleState(config) {
  const words = config.words.map((word) => word.toUpperCase());
  return {
    title: `Find all ${words.length} words on the ${config.size} x ${config.size} board.`,
    words,
    size: config.size,
    grid: generateGrid(words, config.size),
    foundWords: new Set(),
    foundCells: new Set(),
    activeCells: [],
    pointerDown: false,
    activeDirection: null
  };
}

function getCellKey(row, column) {
  return `${row},${column}`;
}

function startGame(config) {
  currentConfig = {
    words: [...config.words],
    size: config.size
  };
  gameState = buildPuzzleState(currentConfig);
  resetTimer();
  renderScreen("game");
  render();
}

function generateGrid(words, size) {
  const directions = [
    { row: 0, column: 1 },
    { row: 1, column: 0 },
    { row: 1, column: 1 },
    { row: 1, column: -1 },
    { row: 0, column: -1 },
    { row: -1, column: 0 },
    { row: -1, column: -1 },
    { row: -1, column: 1 }
  ];
  const diagonalDirections = directions.filter(
    (direction) => Math.abs(direction.row) === 1 && Math.abs(direction.column) === 1
  );
  const maxAttempts = 600;
  const diagonalWordTarget = Math.ceil(words.length / 2);

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const grid = Array.from({ length: size }, () => Array(size).fill(""));
    let allPlaced = true;
    const shuffledWords = shuffle([...words]);
    const diagonalWords = new Set(shuffledWords.slice(0, diagonalWordTarget));

    for (const word of shuffledWords) {
      const placements = [];
      const allowedDirections = diagonalWords.has(word) ? diagonalDirections : directions;

      for (let row = 0; row < size; row += 1) {
        for (let column = 0; column < size; column += 1) {
          for (const direction of allowedDirections) {
            if (canPlaceWord(grid, word, row, column, direction)) {
              placements.push({ row, column, direction });
            }
          }
        }
      }

      if (placements.length === 0) {
        allPlaced = false;
        break;
      }

      const choice = placements[Math.floor(Math.random() * placements.length)];
      placeWord(grid, word, choice.row, choice.column, choice.direction);
    }

    if (allPlaced) {
      fillEmptyCells(grid);
      return grid;
    }
  }

  throw new Error("Unable to generate a valid puzzle grid.");
}

function canPlaceWord(grid, word, startRow, startColumn, direction) {
  for (let index = 0; index < word.length; index += 1) {
    const row = startRow + direction.row * index;
    const column = startColumn + direction.column * index;

    if (row < 0 || row >= grid.length || column < 0 || column >= grid.length) {
      return false;
    }

    const currentValue = grid[row][column];
    if (currentValue !== "" && currentValue !== word[index]) {
      return false;
    }
  }

  return true;
}

function placeWord(grid, word, startRow, startColumn, direction) {
  for (let index = 0; index < word.length; index += 1) {
    const row = startRow + direction.row * index;
    const column = startColumn + direction.column * index;
    grid[row][column] = word[index];
  }
}

function fillEmptyCells(grid) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let row = 0; row < grid.length; row += 1) {
    for (let column = 0; column < grid[row].length; column += 1) {
      if (grid[row][column] === "") {
        grid[row][column] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }

  return items;
}

function render() {
  renderBoard();
  renderWordList();
  updateStatus();
}

function renderBoard() {
  boardElement.innerHTML = "";
  boardElement.style.gridTemplateColumns = `repeat(${gameState.size}, minmax(0, 1fr))`;

  for (let row = 0; row < gameState.grid.length; row += 1) {
    for (let column = 0; column < gameState.grid[row].length; column += 1) {
      const button = document.createElement("button");
      const key = getCellKey(row, column);

      button.type = "button";
      button.className = "cell";
      button.textContent = gameState.grid[row][column];
      button.dataset.row = String(row);
      button.dataset.column = String(column);
      button.setAttribute("role", "gridcell");
      button.setAttribute("aria-label", `Row ${row + 1} Column ${column + 1}: ${button.textContent}`);

      if (gameState.foundCells.has(key)) {
        button.classList.add("found");
      } else if (gameState.activeCells.some((cell) => cell.row === row && cell.column === column)) {
        button.classList.add("selected");
      }

      button.addEventListener("pointerdown", handlePointerDown);
      boardElement.appendChild(button);
    }
  }
}

function renderWordList() {
  wordListElement.innerHTML = "";

  gameState.words.forEach((word) => {
    const item = document.createElement("li");
    const tag = document.createElement("span");

    item.className = gameState.foundWords.has(word) ? "found" : "pending";
    item.textContent = word;

    tag.className = "tag";
    tag.textContent = gameState.foundWords.has(word) ? "Found" : "Hidden";
    item.appendChild(tag);

    wordListElement.appendChild(item);
  });
}

function updateStatus() {
  const remaining = gameState.words.length - gameState.foundWords.size;
  statusTextElement.textContent =
    remaining === 0
      ? "Every word is locked in."
      : `${gameState.title} ${remaining} remaining.`;

  celebrationCardElement.classList.toggle("hidden", remaining !== 0);

  if (remaining === 0) {
    stopTimer();
  }
}

function handlePointerDown(event) {
  const button = event.currentTarget;
  const row = Number(button.dataset.row);
  const column = Number(button.dataset.column);

  event.preventDefault();
  gameState.pointerDown = true;
  gameState.activeDirection = null;
  gameState.activeCells = [{ row, column }];

  renderBoard();
}

function handlePointerMove(event) {
  if (!gameState.pointerDown) {
    return;
  }

  const target = document.elementFromPoint(event.clientX, event.clientY);
  const button = target?.closest(".cell");

  if (!button || !boardElement.contains(button)) {
    return;
  }

  const row = Number(button.dataset.row);
  const column = Number(button.dataset.column);
  const nextPath = getPathFromStart(row, column);

  if (nextPath.length > 0) {
    gameState.activeCells = nextPath;
    renderBoard();
  }
}

function handlePointerUp() {
  if (!gameState.pointerDown) {
    return;
  }

  const selectedWord = gameState.activeCells
    .map(({ row, column }) => gameState.grid[row][column])
    .join("");
  const reversedWord = selectedWord.split("").reverse().join("");

  const matchedWord = gameState.words.find(
    (word) => !gameState.foundWords.has(word) && (word === selectedWord || word === reversedWord)
  );

  if (matchedWord) {
    gameState.foundWords.add(matchedWord);
    gameState.activeCells.forEach(({ row, column }) => gameState.foundCells.add(getCellKey(row, column)));
  }

  gameState.pointerDown = false;
  gameState.activeDirection = null;
  gameState.activeCells = [];
  render();
}

function getPathFromStart(targetRow, targetColumn) {
  const start = gameState.activeCells[0];
  const deltaRow = targetRow - start.row;
  const deltaColumn = targetColumn - start.column;

  const stepRow = Math.sign(deltaRow);
  const stepColumn = Math.sign(deltaColumn);
  const rowDistance = Math.abs(deltaRow);
  const columnDistance = Math.abs(deltaColumn);
  const isStraight = deltaRow === 0 || deltaColumn === 0 || rowDistance === columnDistance;

  if (!isStraight) {
    return gameState.activeCells;
  }

  if (gameState.activeDirection) {
    const sameDirection =
      gameState.activeDirection.stepRow === stepRow && gameState.activeDirection.stepColumn === stepColumn;

    if (!sameDirection && rowDistance + columnDistance > 0) {
      return gameState.activeCells;
    }
  }

  const distance = Math.max(rowDistance, columnDistance);
  const path = [];

  for (let offset = 0; offset <= distance; offset += 1) {
    path.push({
      row: start.row + stepRow * offset,
      column: start.column + stepColumn * offset
    });
  }

  if (distance > 0) {
    gameState.activeDirection = { stepRow, stepColumn };
  }

  return path;
}

boardElement.addEventListener("pointermove", handlePointerMove);
window.addEventListener("pointerup", handlePointerUp);
window.addEventListener("pointercancel", handlePointerUp);

function resetTimer() {
  stopTimer();
  gameState.startedAt = Date.now();
  updateTimerDisplay();
  timerIntervalId = window.setInterval(updateTimerDisplay, 1000);
}

function stopTimer() {
  if (timerIntervalId !== null) {
    window.clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
}

function updateTimerDisplay() {
  const elapsedSeconds = Math.floor((Date.now() - gameState.startedAt) / 1000);
  const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
  const seconds = String(elapsedSeconds % 60).padStart(2, "0");
  timerTextElement.textContent = `${minutes}:${seconds}`;
}

function renderScreen(screen) {
  const isGame = screen === "game";
  setupScreenElement.classList.toggle("hidden", isGame);
  gameScreenElement.classList.toggle("hidden", !isGame);
  restartButton.classList.toggle("hidden", !isGame);
  editSetupButton.classList.toggle("hidden", !isGame);
}

function normalizeWords(rawValue) {
  return rawValue
    .split(/\r?\n/)
    .map((word) => word.trim().toUpperCase().replace(/[^A-Z]/g, ""))
    .filter(Boolean);
}

function calculateMinimumBoardSize(words) {
  if (words.length === 0) {
    return 0;
  }

  const longestWord = Math.max(...words.map((word) => word.length));
  const totalLetters = words.reduce((sum, word) => sum + word.length, 0);
  return Math.max(longestWord, Math.ceil(Math.sqrt(totalLetters * 1.35)));
}

function buildSizeOptions(minimumSize) {
  if (minimumSize === 0) {
    return [];
  }

  const maxSize = minimumSize + 8;
  const options = [];

  for (let size = minimumSize; size <= maxSize; size += 1) {
    options.push(size);
  }

  return options;
}

function updateSetupPreview() {
  const words = normalizeWords(wordsInputElement.value);
  const limitedWords = words.slice(0, MAX_WORDS);
  const ignoredWordCount = Math.max(0, words.length - MAX_WORDS);
  const minimumSize = calculateMinimumBoardSize(limitedWords);
  const sizeOptions = buildSizeOptions(minimumSize);

  minimumSizeTextElement.textContent = `Minimum size: ${minimumSize} x ${minimumSize}`;
  wordCountTextElement.textContent =
    limitedWords.length === 1 ? "1 word ready" : `${limitedWords.length} words ready`;
  sizeHintTextElement.textContent =
    sizeOptions.length > 0
      ? `Available sizes: ${sizeOptions.map((size) => `${size} x ${size}`).join(", ")}`
      : "Add a few words to unlock size options.";

  if (ignoredWordCount > 0) {
    sizeHintTextElement.textContent += ` Only the first ${MAX_WORDS} words will be used.`;
  }

  boardSizeSelectElement.innerHTML = "";
  boardSizeSelectElement.disabled = sizeOptions.length === 0;

  if (sizeOptions.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Add words to choose a board size";
    boardSizeSelectElement.appendChild(option);
    return;
  }

  sizeOptions.forEach((size) => {
    const option = document.createElement("option");
    option.value = String(size);
    option.textContent = `${size} x ${size}`;
    boardSizeSelectElement.appendChild(option);
  });
}

function showSetupError(message) {
  setupErrorElement.textContent = message;
  setupErrorElement.classList.remove("hidden");
}

function clearSetupError() {
  setupErrorElement.textContent = "";
  setupErrorElement.classList.add("hidden");
}

function handleSetupSubmit(event) {
  event.preventDefault();
  const normalizedWords = normalizeWords(wordsInputElement.value);

  if (normalizedWords.length > MAX_WORDS) {
    showSetupError(`Use ${MAX_WORDS} words or fewer to start a game.`);
    return;
  }

  const words = normalizedWords.slice(0, MAX_WORDS);

  if (words.length < 2) {
    showSetupError("Enter at least two words to build a puzzle.");
    return;
  }

  const minimumSize = calculateMinimumBoardSize(words);
  const selectedSize = Number(boardSizeSelectElement.value);

  if (!selectedSize || selectedSize < minimumSize) {
    showSetupError("Choose one of the available board sizes before starting.");
    return;
  }

  clearSetupError();

  try {
    startGame({ words, size: selectedSize });
  } catch (error) {
    showSetupError("That size is a little too tight for this list. Try a larger board.");
  }
}

function returnToSetup() {
  stopTimer();
  if (gameState) {
    gameState.pointerDown = false;
  }
  timerTextElement.textContent = "00:00";
  renderScreen("setup");
}

function restartCurrentGame() {
  if (!currentConfig) {
    return;
  }

  startGame(currentConfig);
}

restartButton.addEventListener("click", restartCurrentGame);
editSetupButton.addEventListener("click", returnToSetup);
setupFormElement.addEventListener("submit", handleSetupSubmit);
wordsInputElement.addEventListener("input", () => {
  clearSetupError();
  updateSetupPreview();
});

wordsInputElement.value = DEFAULT_WORDS.join("\n");
updateSetupPreview();
renderScreen("setup");
