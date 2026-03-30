export type Card = {
  id: string;
  title: string;
  details: string;
};

export type Column = {
  id: string;
  name: string;
  cards: Card[];
};

export type BoardState = {
  columns: Column[];
};

const initialColumns: Column[] = [
  {
    id: "column-strategy",
    name: "Strategy",
    cards: [
      {
        id: "card-vision-refresh",
        title: "Refresh product vision",
        details: "Tighten the positioning narrative before kickoff with stakeholders.",
      },
      {
        id: "card-research-calls",
        title: "Schedule research calls",
        details: "Line up three customer interviews for the next sprint planning session.",
      },
    ],
  },
  {
    id: "column-design",
    name: "Design",
    cards: [
      {
        id: "card-dashboard-flow",
        title: "Map dashboard flow",
        details: "Finalize the hero metrics and supporting panels for the opening view.",
      },
      {
        id: "card-motion-pass",
        title: "Motion polish pass",
        details: "Add transition notes for card interactions and contextual hover states.",
      },
    ],
  },
  {
    id: "column-build",
    name: "Build",
    cards: [
      {
        id: "card-kanban-shell",
        title: "Implement board shell",
        details: "Assemble responsive layout, spacing system, and reusable card treatment.",
      },
    ],
  },
  {
    id: "column-review",
    name: "Review",
    cards: [
      {
        id: "card-content-check",
        title: "Content QA",
        details: "Review tone, labels, and empty states for a tighter first impression.",
      },
    ],
  },
  {
    id: "column-launch",
    name: "Launch",
    cards: [
      {
        id: "card-demo-script",
        title: "Prepare demo script",
        details: "Outline the 90-second walkthrough for the MVP handoff.",
      },
    ],
  },
];

export const initialBoardState = (): BoardState => ({
  columns: initialColumns.map((column) => ({
    ...column,
    cards: column.cards.map((card) => ({ ...card })),
  })),
});

export const renameColumn = (
  board: BoardState,
  columnId: string,
  nextName: string,
): BoardState => ({
  columns: board.columns.map((column) =>
    column.id === columnId
      ? { ...column, name: nextName.trim() || column.name }
      : column,
  ),
});

export const addCard = (
  board: BoardState,
  columnId: string,
  card: Card,
): BoardState => ({
  columns: board.columns.map((column) =>
    column.id === columnId
      ? { ...column, cards: [...column.cards, card] }
      : column,
  ),
});

export const deleteCard = (
  board: BoardState,
  columnId: string,
  cardId: string,
): BoardState => ({
  columns: board.columns.map((column) =>
    column.id === columnId
      ? {
          ...column,
          cards: column.cards.filter((card) => card.id !== cardId),
        }
      : column,
  ),
});

const reorder = <T,>(items: T[], fromIndex: number, toIndex: number): T[] => {
  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, item);
  return nextItems;
};

export const moveCard = (
  board: BoardState,
  activeCardId: string,
  overCardId: string | null,
  overColumnId: string | null,
): BoardState => {
  const sourceColumn = board.columns.find((column) =>
    column.cards.some((card) => card.id === activeCardId),
  );

  if (!sourceColumn) {
    return board;
  }

  const sourceIndex = sourceColumn.cards.findIndex(
    (card) => card.id === activeCardId,
  );
  const activeCard = sourceColumn.cards[sourceIndex];

  if (!activeCard) {
    return board;
  }

  if (overCardId && sourceColumn.cards.some((card) => card.id === overCardId)) {
    const targetIndex = sourceColumn.cards.findIndex((card) => card.id === overCardId);

    if (targetIndex === -1 || targetIndex === sourceIndex) {
      return board;
    }

    return {
      columns: board.columns.map((column) =>
        column.id === sourceColumn.id
          ? { ...column, cards: reorder(column.cards, sourceIndex, targetIndex) }
          : column,
      ),
    };
  }

  const destinationColumnId =
    overColumnId ??
    board.columns.find((column) => column.cards.some((card) => card.id === overCardId))
      ?.id;

  if (!destinationColumnId || destinationColumnId === sourceColumn.id) {
    return board;
  }

  return {
    columns: board.columns.map((column) => {
      if (column.id === sourceColumn.id) {
        return {
          ...column,
          cards: column.cards.filter((card) => card.id !== activeCardId),
        };
      }

      if (column.id === destinationColumnId) {
        return {
          ...column,
          cards: [...column.cards, activeCard],
        };
      }

      return column;
    }),
  };
};
