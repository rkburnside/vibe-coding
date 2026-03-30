import { describe, expect, it } from "vitest";

import {
  addCard,
  createInitialBoard,
  deleteCard,
  moveCard,
  renameColumn,
  type BoardState,
} from "./board";

describe("board helpers", () => {
  it("creates a seeded board with five columns", () => {
    const board = createInitialBoard();

    expect(board.columns).toHaveLength(5);
    expect(board.columns.flatMap((column) => column.cards)).toHaveLength(10);
  });

  it("renames a column with trimmed text", () => {
    const board = createInitialBoard();
    const renamed = renameColumn(board, "brief", "  Strategy  ");

    expect(renamed.columns[0].title).toBe("Strategy");
  });

  it("adds a card only when title and details are present", () => {
    const board = createInitialBoard();
    const unchanged = addCard(board, "build", {
      title: "  New idea  ",
      details: "   ",
    });
    const updated = addCard(board, "build", {
      title: "New idea",
      details: "Wrap the interaction in a cleaner motion pass.",
    });

    expect(unchanged).toBe(board);
    expect(updated.columns[2].cards).toHaveLength(board.columns[2].cards.length + 1);
    expect(updated.columns[2].cards.at(-1)?.title).toBe("New idea");
  });

  it("deletes a card from whichever column contains it", () => {
    const board = createInitialBoard();
    const updated = deleteCard(board, "card-mobile-spacing");

    expect(
      updated.columns[3].cards.find((card) => card.id === "card-mobile-spacing"),
    ).toBeUndefined();
  });

  it("moves a card ahead of another card in a different column", () => {
    const board = createInitialBoard();
    const moved = moveCard(board, "card-kickoff-notes", {
      type: "card",
      cardId: "card-module-map",
    });

    expect(
      moved.columns[0].cards.find((card) => card.id === "card-kickoff-notes"),
    ).toBeUndefined();
    expect(moved.columns[1].cards.map((card) => card.id).slice(0, 2)).toEqual([
      "card-kickoff-notes",
      "card-module-map",
    ]);
  });

  it("moves a card into an empty column", () => {
    const board: BoardState = {
      columns: [
        {
          id: "brief",
          title: "Brief",
          cards: [
            {
              id: "card-1",
              title: "Card one",
              details: "Move me to the empty lane.",
            },
          ],
        },
        {
          id: "launch",
          title: "Launch",
          cards: [],
        },
      ],
    };

    const moved = moveCard(board, "card-1", {
      type: "column",
      columnId: "launch",
    });

    expect(moved.columns[0].cards).toHaveLength(0);
    expect(moved.columns[1].cards[0]?.id).toBe("card-1");
  });
});
