const DEFAULT_WORDS = [
  "ACORN",
  "AMBER",
  "ANCHOR",
  "APPLE",
  "ARCADE",
  "ASTEROID",
  "ATLAS",
  "AURORA",
  "AVALANCHE",
  "BAMBOO",
  "BANANA",
  "BEACON",
  "BLIZZARD",
  "BONFIRE",
  "BRIDGE",
  "BUTTERCUP",
  "CACTUS",
  "CAMERA",
  "CANDLE",
  "CARAMEL",
  "CASCADE",
  "CASTLE",
  "CAVERN",
  "CEDAR",
  "CHAMPION",
  "CINNAMON",
  "CITADEL",
  "CLOVER",
  "COMET",
  "CORAL",
  "CRYSTAL",
  "CUPCAKE",
  "DAHLIA",
  "DESERT",
  "DIAMOND",
  "DRAGONFLY",
  "DRIZZLE",
  "ECHO",
  "EMBER",
  "EMERALD",
  "FALCON",
  "FEATHER",
  "FESTIVAL",
  "FIRELIGHT",
  "FJORD",
  "FOREST",
  "FOSSIL",
  "GALAXY",
  "GARDEN",
  "GAZELLE",
  "GLACIER",
  "HARBOR",
  "HARMONY",
  "HAZELNUT",
  "HORIZON",
  "ICICLE",
  "ISLAND",
  "IVY",
  "JASMINE",
  "JELLYBEAN",
  "JUNIPER",
  "KINGDOM",
  "LANTERN",
  "LAVENDER",
  "LEMONADE",
  "LIGHTHOUSE",
  "LOTUS",
  "MARBLE",
  "MEADOW",
  "METEOR",
  "MIDNIGHT",
  "MISTY",
  "MOONBEAM",
  "NEBULA",
  "NECTARINE",
  "OASIS",
  "OBSIDIAN",
  "ORCHARD",
  "OTTER",
  "PARADISE",
  "PEBBLE",
  "PEPPERMINT",
  "PHOENIX",
  "PINEAPPLE",
  "PRAIRIE",
  "QUARTZ",
  "RAINBOW",
  "RAVEN",
  "RIVER",
  "SAFFRON",
  "SEASHELL",
  "SHADOW",
  "SOLSTICE",
  "SPARROW",
  "STARLIGHT",
  "SUNFLOWER",
  "THUNDER",
  "TREASURE",
  "TULIP",
  "VELVET",
  "WATERFALL",
  "WHISPER",
  "WILDFLOWER",
  "ZEPPELIN"
];
const MAX_WORDS = 30;
const STARTER_WORD_COUNT = 10;
const WORD_POOLS = {
  Random: DEFAULT_WORDS,
  Aviation: [
    "AILERON", "AIRSPEED", "AIRWAY", "ALTIMETER", "APPROACH", "APRON", "ATTITUDE", "AVGAS", "AVIATOR",
    "BALLOON", "BANKING", "BEACON", "BLACKBOX", "BRIEFING", "CABINS", "CARGO", "CHECKLIST", "CLIMB",
    "COCKPIT", "COMPASS", "CONTRAIL", "CROSSWIND", "CRUISING", "DESCENT", "DIRECTIONS", "DRAG", "DRONE",
    "ELEVATOR", "EMPENNAGE", "ENGINE", "FERRY", "FINAL", "FLAPS", "FLARE", "FUSELAGE", "GLIDER",
    "GROUNDSPEED", "HANGAR", "HEADING", "HELIPAD", "HOLDING", "HORIZON", "JETWAY", "JOYSTICK", "LANDING",
    "LIFTOFF", "LOGBOOK", "MANEUVER", "MAYDAY", "NAVLIGHT", "NOSEDIVE", "OAT", "PARACHUTE", "PAYLOAD",
    "PITCH", "PROPELLER", "RADAR", "RUNWAY", "RUDDER", "SEAPLANE", "SIDESTICK", "SKIDS", "SLATS",
    "SLIPSTREAM", "SOARING", "SPOILER", "STALL", "STARBOARD", "STEWARD", "TAILWIND", "TAKEOFF", "TAXIWAY",
    "TERMINAL", "THROTTLE", "TOUCHDOWN", "TOWER", "TRAFFIC", "TRIM", "TURBINE", "TURNAROUND", "UPDRAFT",
    "VECTOR", "VFR", "VORTEX", "WEATHER", "WINGLET", "YAW", "YOKE", "AIRLINER", "AUTOPILOT", "BIRDSTRIKE",
    "DEICING", "GOAROUND", "HEADWIND", "JETSTREAM", "LAYOVER", "OVERSHOOT", "TAILPLANE", "WAYPOINT"
  ],
  Finance: [
    "ACCOUNT", "ACCRUAL", "AMORTIZE", "ANALYST", "ANNUITY", "ASSETS", "BALANCE", "BANKING", "BOND",
    "BROKER", "BUDGET", "BULLMARKET", "CAPITAL", "CASHFLOW", "CLEARING", "COLLATERAL", "COMMODITY",
    "COMPOUND", "COUPON", "CREDIT", "CURRENCY", "CUSTODIAN", "DEBIT", "DEFAULT", "DEPOSIT", "DERIVATIVE",
    "DIVIDEND", "EARNINGS", "EQUITY", "ESCROW", "EXPENSE", "FEDFUNDS", "FINANCE", "FORECAST", "FUTURES",
    "GAINS", "HEDGING", "HOLDINGS", "INCOME", "INDEX", "INFLATION", "INTEREST", "INVOICE", "ISSUER",
    "JOURNAL", "LEDGER", "LEVERAGE", "LIABILITY", "LIQUIDITY", "LOAN", "MARGIN", "MARKETCAP", "MATURITY",
    "MERGER", "MUTUALFUND", "NASDAQ", "NETWORTH", "NOTIONAL", "OPTION", "PAYABLE", "PAYEE", "PAYROLL",
    "PENSION", "PORTFOLIO", "PREMIUM", "PRINCIPAL", "PROFIT", "QUOTE", "RATING", "RECEIPT", "RECONCILE",
    "REFINANCE", "RESERVE", "REVENUE", "RISK", "ROYALTY", "SAVINGS", "SECURITY", "SETTLEMENT", "SHARES",
    "SHORTSALE", "SOLVENCY", "SPREAD", "STATEMENT", "STOCKS", "SWAP", "TARIFF", "TAXES", "TICKER", "TRADE",
    "TREASURY", "TURNOVER", "UNDERWRITE", "VALUATION", "VENTURE", "VOLATILITY", "WALLET", "WEALTH", "YIELD"
  ],
  Bookkeeping: [
    "ACCOUNT", "ACCRUAL", "AGING", "ALLOCATION", "AMORTIZE", "APLEDGER", "ARLEDGER", "ASSETS", "AUDIT",
    "BALANCE", "BANKFEED", "BANKREC", "BILLABLE", "BOOKKEEPER", "CAPITAL", "CASHBOOK", "CASHFLOW",
    "CHARTOFACCT", "CHECKNUM", "CLEARED", "CLOSING", "CODING", "COSTING", "CREDIT", "CREDITMEMO", "DAYBOOK",
    "DEBIT", "DEPRECIATE", "DISBURSE", "DRAWINGS", "EQUITY", "EXPENSE", "FISCALYEAR", "FIXEDASSET",
    "GENERALLEDG", "GROSSPAY", "INCOME", "INVOICE", "ITEMIZE", "JOURNAL", "LIABILITY", "LINEITEM",
    "MANUALENTRY", "MARKUP", "NETPAY", "OPENINGBAL", "OVERHEAD", "OWNERDRAW", "PAYABLE", "PAYEE", "PAYROLL",
    "PETTYCASH", "POSTING", "PREPAID", "PROFITLOSS", "PURCHASE", "QUICKBOOKS", "RECEIPT", "RECONCILE",
    "REMITTANCE", "RETAINED", "REVENUE", "SALES", "SALESTAX", "STATEMENT", "SUBLEDGER", "SUNDRY", "SUPPLIER",
    "TAXABLE", "TIMESHEET", "TRACKING", "TRANSACTION", "TRIALBAL", "UNAPPLIED", "VARIANCE", "VENDOR",
    "VOIDED", "WITHHOLDING", "WORKSHEET", "WRITEOFF", "YEAREND", "ADJUSTMENT", "ALLOWANCE", "BACKUP",
    "CASHBASIS", "CREDITNOTE", "DEBITNOTE", "DISCOUNT", "EFTPAYMENT", "ESTIMATE", "FILECOPY", "GROSSPROFIT",
    "INVENTORY", "OVERPAYMENT", "PURCHASEORD", "REFERENCE", "REVERSAL", "SERVICEITEM", "SUBTOTAL", "TRANSFER"
  ],
  "Mormon Words": [
    "AARONIC", "AGENCY", "ALTAR", "ATONEMENT", "BAPTISM", "BEEHIVE", "BISHOP", "BLESSINGS", "BOOKOFMORMON",
    "CALLING", "CELESTIAL", "CHARITY", "CONVERT", "COVENANT", "DEACON", "DESERET", "ENDOWMENT", "ENDURE",
    "ETERNAL", "EXALTATION", "FAITH", "FASTING", "FELLOWSHIP", "FOREORDINATION", "GENEALOGY", "GENTILES",
    "GOSPEL", "GRACE", "HEAVENLY", "HIGHPRIEST", "HOMEEVENING", "HOSANNA", "INSTITUTE", "IRONROD", "JEREDITES",
    "JOSEPHSMITH", "KINGBENJAMIN", "LAMANITES", "LEHI", "LIBERTYJAIL", "MAELCHIZEDEK", "MISSIONARY", "MODESTY",
    "MORONI", "NEPHI", "ORDINANCE", "PATRIARCH", "PIONEER", "PLANOFSALV", "PRAYER", "PRIESTHOOD", "PRIMARY",
    "PROPHET", "REDEEMER", "RELIEFSOC", "REPENTANCE", "RESTORATION", "RESURRECTION", "SABBATH", "SACRAMENT",
    "SALVATION", "SANCTIFY", "SEMINARY", "SERVICE", "SEVENTY", "STAKE", "STEWARDSHIP", "STRIPLING", "TABERNACLE",
    "TEMPLE", "TENDERMERCIES", "TESTIMONY", "TITHING", "WARD", "ZION", "YOUNGWOMEN", "YOUNGMEN",
    "BEOFGOODCHEER", "CHOOSETHERIGHT", "COMEFOLLOWME", "ENDURETOEND", "FAMILIESFOREVER", "FAITHINCHRIST",
    "FOLLOWPROPHET", "GATHERISRAEL", "HOLYGHOST", "HOLDTOROD", "HOUSEOFLORD", "IAMACHILD", "INTHEWORLD",
    "JOYINCHRIST", "KEEPCOMMANDMENTS", "MINISTERONE", "STILLSMALLVOICE", "TENDERMERCIES", "THINKCELESTIAL",
    "TRUSTINGOD", "WALKINLIGHT"
  ],
  "Mormon and Bible Books": [
    "1NEPHI", "2NEPHI", "JACOB", "ENOS", "JAROM", "OMNI", "MOSIAH", "ALMA", "HELAMAN", "3NEPHI", "4NEPHI",
    "MORMON", "ETHER", "MORONI", "GENESIS", "EXODUS", "LEVITICUS", "NUMBERS", "DEUTERONOMY", "JOSHUA", "JUDGES",
    "RUTH", "1SAMUEL", "2SAMUEL", "1KINGS", "2KINGS", "1CHRONICLES", "2CHRONICLES", "EZRA", "NEHEMIAH", "ESTHER",
    "JOB", "PSALMS", "PROVERBS", "ECCLESIASTES", "SONGOFSONGS", "ISAIAH", "JEREMIAH", "LAMENTATIONS", "EZEKIEL",
    "DANIEL", "HOSEA", "JOEL", "AMOS", "OBADIAH", "JONAH", "MICAH", "NAHUM", "HABAKKUK", "ZEPHANIAH", "HAGGAI",
    "ZECHARIAH", "MALACHI", "MATTHEW", "MARK", "LUKE", "JOHN", "ACTS", "ROMANS", "1CORINTHIANS", "2CORINTHIANS",
    "GALATIANS", "EPHESIANS", "PHILIPPIANS", "COLOSSIANS", "1THESSALONIANS", "2THESSALONIANS", "1TIMOTHY",
    "2TIMOTHY", "TITUS", "PHILEMON", "HEBREWS", "JAMES", "1PETER", "2PETER", "1JOHN", "2JOHN", "3JOHN", "JUDE",
    "REVELATION", "MOSES", "ABRAHAM", "FACSIMILES", "JSTMATTHEW", "JSTGENESIS", "ARTICLESOFFAITH", "DC1", "DC2",
    "DC3", "DC4", "DC5", "DC6", "DC7", "DC8", "DC9", "DC10", "DC20", "DC76", "DC89", "DC121", "DC122", "DC123"
  ]
};
const FOUND_WORD_COLORS = [
  "#e4572e",
  "#3a86ff",
  "#2a9d8f",
  "#ff006e",
  "#8338ec",
  "#ffbe0b",
  "#118ab2",
  "#ef476f",
  "#06d6a0",
  "#fb5607",
  "#4361ee",
  "#7cb518"
];
const boardElement = document.getElementById("board");
const boardOverlayElement = document.getElementById("boardOverlay");
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
const wordListSelectElement = document.getElementById("wordListSelect");
const wordCountSelectElement = document.getElementById("wordCountSelect");
const boardSizeSelectElement = document.getElementById("boardSizeSelect");
const minimumSizeTextElement = document.getElementById("minimumSizeText");
const wordCountTextElement = document.getElementById("wordCountText");
const sizeHintTextElement = document.getElementById("sizeHintText");
const setupErrorElement = document.getElementById("setupError");

let gameState = null;
let timerIntervalId = null;
let currentConfig = null;
let isApplyingStarterWords = false;

function buildPuzzleState(config) {
  const words = config.words.map((word) => word.toUpperCase());
  return {
    words,
    size: config.size,
    grid: generateGrid(words, config.size),
    foundWords: new Set(),
    foundWordPaths: [],
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

function getStarterWords() {
  const requestedCount = Number(wordCountSelectElement?.value || STARTER_WORD_COUNT);
  const selectedListName = wordListSelectElement?.value || "Random";
  const sourceWords = WORD_POOLS[selectedListName] || DEFAULT_WORDS;
  return shuffle([...sourceWords]).slice(0, requestedCount);
}

function populateWordListOptions() {
  wordListSelectElement.innerHTML = "";

  Object.keys(WORD_POOLS).forEach((listName) => {
    const option = document.createElement("option");
    option.value = listName;
    option.textContent = listName;
    if (listName === "Random") {
      option.selected = true;
    }
    wordListSelectElement.appendChild(option);
  });
}

function populateWordCountOptions() {
  wordCountSelectElement.innerHTML = "";

  for (let count = 10; count <= 30; count += 1) {
    const option = document.createElement("option");
    option.value = String(count);
    option.textContent = String(count);
    if (count === STARTER_WORD_COUNT) {
      option.selected = true;
    }
    wordCountSelectElement.appendChild(option);
  }
}

function applyStarterWords() {
  isApplyingStarterWords = true;
  wordsInputElement.value = getStarterWords().join("\n");
  isApplyingStarterWords = false;
  clearSetupError();
  updateSetupPreview();
}

function render() {
  renderBoard();
  renderFoundWordOverlay();
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

      if (gameState.activeCells.some((cell) => cell.row === row && cell.column === column)) {
        button.classList.add("selected");
      }

      button.addEventListener("pointerdown", handlePointerDown);
      boardElement.appendChild(button);
    }
  }
}

function renderFoundWordOverlay() {
  boardOverlayElement.innerHTML = "";

  const boardRect = boardElement.getBoundingClientRect();
  if (!boardRect.width || !boardRect.height) {
    return;
  }

  boardOverlayElement.setAttribute("viewBox", `0 0 ${boardRect.width} ${boardRect.height}`);

  gameState.foundWordPaths.forEach((entry) => {
    const firstCell = getCellElement(entry.cells[0]);
    const lastCell = getCellElement(entry.cells[entry.cells.length - 1]);

    if (!firstCell || !lastCell) {
      return;
    }

    const firstRect = firstCell.getBoundingClientRect();
    const lastRect = lastCell.getBoundingClientRect();
    const startX = firstRect.left - boardRect.left + firstRect.width / 2;
    const startY = firstRect.top - boardRect.top + firstRect.height / 2;
    const endX = lastRect.left - boardRect.left + lastRect.width / 2;
    const endY = lastRect.top - boardRect.top + lastRect.height / 2;
    const cellSize = Math.min(firstRect.width, firstRect.height);
    const radius = Math.max(8, cellSize * 0.42);
    const outlineWidth = Math.max(2.5, cellSize * 0.1);
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const length = Math.hypot(deltaX, deltaY) || 1;
    const midpointX = (startX + endX) / 2;
    const midpointY = (startY + endY) / 2;
    const totalLength = length + radius * 1.8;
    const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

    const halo = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    halo.setAttribute("x", String(midpointX - totalLength / 2));
    halo.setAttribute("y", String(midpointY - radius));
    halo.setAttribute("width", String(totalLength));
    halo.setAttribute("height", String(radius * 2));
    halo.setAttribute("rx", String(radius));
    halo.setAttribute("ry", String(radius));
    halo.setAttribute("fill", "none");
    halo.setAttribute("stroke", "rgba(255, 255, 255, 0.9)");
    halo.setAttribute("stroke-width", String(outlineWidth + 2));
    halo.setAttribute("transform", `rotate(${angle} ${midpointX} ${midpointY})`);

    const stroke = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    stroke.setAttribute("x", String(midpointX - totalLength / 2));
    stroke.setAttribute("y", String(midpointY - radius));
    stroke.setAttribute("width", String(totalLength));
    stroke.setAttribute("height", String(radius * 2));
    stroke.setAttribute("rx", String(radius));
    stroke.setAttribute("ry", String(radius));
    stroke.setAttribute("fill", "none");
    stroke.setAttribute("stroke", entry.color);
    stroke.setAttribute("stroke-width", String(outlineWidth));
    stroke.setAttribute("opacity", "0.95");
    stroke.setAttribute("transform", `rotate(${angle} ${midpointX} ${midpointY})`);

    boardOverlayElement.appendChild(halo);
    boardOverlayElement.appendChild(stroke);
  });
}

function getCellElement(cell) {
  return boardElement.querySelector(`[data-row="${cell.row}"][data-column="${cell.column}"]`);
}

function renderWordList() {
  wordListElement.innerHTML = "";

  gameState.words.forEach((word) => {
    const item = document.createElement("li");

    item.className = gameState.foundWords.has(word) ? "found" : "pending";
    item.textContent = word;

    wordListElement.appendChild(item);
  });
}

function updateStatus() {
  const foundCount = gameState.foundWords.size;
  const totalCount = gameState.words.length;
  statusTextElement.textContent = `${foundCount} of ${totalCount} words found`;

  celebrationCardElement.classList.toggle("hidden", foundCount !== totalCount);

  if (foundCount === totalCount) {
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
    gameState.foundWordPaths.push({
      word: matchedWord,
      color: FOUND_WORD_COLORS[gameState.foundWordPaths.length % FOUND_WORD_COLORS.length],
      cells: gameState.activeCells.map(({ row, column }) => ({ row, column }))
    });
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
  if (isApplyingStarterWords) {
    return;
  }

  clearSetupError();
  updateSetupPreview();
});

wordCountSelectElement.addEventListener("change", () => {
  applyStarterWords();
});

wordListSelectElement.addEventListener("change", () => {
  applyStarterWords();
});

function initializeApp() {
  populateWordListOptions();
  populateWordCountOptions();
  applyStarterWords();
  renderScreen("setup");
}

initializeApp();

window.addEventListener("resize", () => {
  if (gameState) {
    renderFoundWordOverlay();
  }
});
