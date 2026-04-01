const PUZZLES = [
  {
    title: "Find all 8 words.",
    words: ["CHROME", "PUZZLE", "SEARCH", "GRID", "DRAG", "MOUSE", "TOUCH", "FRAME"]
  },
  {
    title: "A fresh board with 8 hidden words.",
    words: ["SCRIPT", "CANVAS", "LETTER", "TRACE", "LINES", "BROWSER", "CLICK", "TILE"]
  }
];

const boardElement = document.getElementById("board");
const wordListElement = document.getElementById("wordList");
const statusTextElement = document.getElementById("statusText");
const celebrationCardElement = document.getElementById("celebrationCard");
const restartButton = document.getElementById("restartButton");

let gameState = null;

function buildPuzzleState(puzzle) {
  const words = puzzle.words.map((word) => word.toUpperCase());
  return {
    title: puzzle.title,
    words,
    grid: generateGrid(words, 10),
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

function choosePuzzle() {
  const puzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
  gameState = buildPuzzleState(puzzle);
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
  const maxAttempts = 300;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const grid = Array.from({ length: size }, () => Array(size).fill(""));
    let allPlaced = true;

    const shuffledWords = shuffle([...words]);

    for (const word of shuffledWords) {
      const placements = [];

      for (let row = 0; row < size; row += 1) {
        for (let column = 0; column < size; column += 1) {
          for (const direction of directions) {
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

restartButton.addEventListener("click", choosePuzzle);
boardElement.addEventListener("pointermove", handlePointerMove);
window.addEventListener("pointerup", handlePointerUp);
window.addEventListener("pointercancel", handlePointerUp);

choosePuzzle();
