export type CardData = {
  id: string;
  title: string;
  details: string;
};

export type ColumnData = {
  id: string;
  title: string;
  cards: CardData[];
};

export type BoardState = {
  columns: ColumnData[];
};

export type DropTarget =
  | { type: "column"; columnId: string }
  | { type: "card"; cardId: string };

const seedBoard: BoardState = {
  columns: [
    {
      id: "brief",
      title: "Brief",
      cards: [
        {
          id: "card-kickoff-notes",
          title: "Tighten kickoff notes",
          details: "Pull the client priorities into a single problem statement.",
        },
        {
          id: "card-homepage-story",
          title: "Clarify homepage story",
          details: "Condense the value prop into a three-part narrative arc.",
        },
      ],
    },
    {
      id: "shape",
      title: "Shape",
      cards: [
        {
          id: "card-module-map",
          title: "Map hero module hierarchy",
          details: "Decide what leads visually before the first scroll breakpoint.",
        },
        {
          id: "card-cta-review",
          title: "Review CTA copy",
          details: "Align the button language with the new launch positioning.",
        },
      ],
    },
    {
      id: "build",
      title: "Build",
      cards: [
        {
          id: "card-compose-flow",
          title: "Refine card composer",
          details: "Keep the add-card flow fast, focused, and easy to scan.",
        },
        {
          id: "card-drag-motion",
          title: "Tune drag motion",
          details: "Add smoother lift, shadow, and drop feedback for card moves.",
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      cards: [
        {
          id: "card-regression-pass",
          title: "Run regression pass",
          details: "Verify rename, add, delete, and drag flows on the full board.",
        },
        {
          id: "card-mobile-spacing",
          title: "Polish mobile spacing",
          details: "Check the board framing and card rhythm on narrow viewports.",
        },
      ],
    },
    {
      id: "launch",
      title: "Launch",
      cards: [
        {
          id: "card-release-recap",
          title: "Draft release recap",
          details: "Summarize what shipped and what the team should highlight next.",
        },
        {
          id: "card-handoff-list",
          title: "Share handoff checklist",
          details: "Send the board state with final notes for design and engineering.",
        },
      ],
    },
  ],
};

export function createInitialBoard(): BoardState {
  return {
    columns: seedBoard.columns.map((column) => ({
      ...column,
      cards: column.cards.map((card) => ({ ...card })),
    })),
  };
}

export function findCard(board: BoardState, cardId: string): CardData | null {
  for (const column of board.columns) {
    const card = column.cards.find((candidate) => candidate.id === cardId);

    if (card) {
      return card;
    }
  }

  return null;
}

export function findCardLocation(
  board: BoardState,
  cardId: string,
): { columnIndex: number; cardIndex: number } | null {
  for (const [columnIndex, column] of board.columns.entries()) {
    const cardIndex = column.cards.findIndex((card) => card.id === cardId);

    if (cardIndex !== -1) {
      return { columnIndex, cardIndex };
    }
  }

  return null;
}

export function renameColumn(
  board: BoardState,
  columnId: string,
  rawTitle: string,
): BoardState {
  const title = rawTitle.trim();

  if (!title) {
    return board;
  }

  let changed = false;

  const columns = board.columns.map((column) => {
    if (column.id !== columnId || column.title === title) {
      return column;
    }

    changed = true;
    return { ...column, title };
  });

  return changed ? { columns } : board;
}

export function addCard(
  board: BoardState,
  columnId: string,
  input: Pick<CardData, "title" | "details">,
): BoardState {
  const title = input.title.trim();
  const details = input.details.trim();

  if (!title || !details) {
    return board;
  }

  let changed = false;

  const columns = board.columns.map((column) => {
    if (column.id !== columnId) {
      return column;
    }

    changed = true;

    return {
      ...column,
      cards: [
        ...column.cards,
        {
          id: `card-${globalThis.crypto.randomUUID()}`,
          title,
          details,
        },
      ],
    };
  });

  return changed ? { columns } : board;
}

export function deleteCard(board: BoardState, cardId: string): BoardState {
  let changed = false;

  const columns = board.columns.map((column) => {
    const cards = column.cards.filter((card) => card.id !== cardId);

    if (cards.length === column.cards.length) {
      return column;
    }

    changed = true;
    return { ...column, cards };
  });

  return changed ? { columns } : board;
}

export function moveCard(
  board: BoardState,
  cardId: string,
  target: DropTarget,
): BoardState {
  if (target.type === "card" && target.cardId === cardId) {
    return board;
  }

  const source = findCardLocation(board, cardId);

  if (!source) {
    return board;
  }

  if (target.type === "column") {
    const destinationColumnIndex = board.columns.findIndex(
      (column) => column.id === target.columnId,
    );

    if (destinationColumnIndex === -1) {
      return board;
    }

    const sourceColumn = board.columns[source.columnIndex];

    if (
      destinationColumnIndex === source.columnIndex &&
      source.cardIndex === sourceColumn.cards.length - 1
    ) {
      return board;
    }

    const columns = cloneColumns(board);
    const [movedCard] = columns[source.columnIndex].cards.splice(source.cardIndex, 1);

    if (!movedCard) {
      return board;
    }

    columns[destinationColumnIndex].cards.push(movedCard);
    return { columns };
  }

  const destination = findCardLocation(board, target.cardId);

  if (!destination) {
    return board;
  }

  if (
    destination.columnIndex === source.columnIndex &&
    destination.cardIndex === source.cardIndex
  ) {
    return board;
  }

  const columns = cloneColumns(board);
  const [movedCard] = columns[source.columnIndex].cards.splice(source.cardIndex, 1);

  if (!movedCard) {
    return board;
  }

  const nextDestination = findCardLocation({ columns }, target.cardId);

  if (!nextDestination) {
    return board;
  }

  columns[nextDestination.columnIndex].cards.splice(
    nextDestination.cardIndex,
    0,
    movedCard,
  );

  return { columns };
}

function cloneColumns(board: BoardState): ColumnData[] {
  return board.columns.map((column) => ({
    ...column,
    cards: [...column.cards],
  }));
}
