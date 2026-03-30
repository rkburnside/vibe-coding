import { describe, expect, it } from "vitest";
import {
  addCard,
  deleteCard,
  initialBoardState,
  moveCard,
  renameColumn,
} from "@/lib/board-state";

describe("board-state helpers", () => {
  it("renames a column without changing the others", () => {
    const board = initialBoardState();

    const updated = renameColumn(board, "column-design", "Creative");

    expect(updated.columns[1]?.name).toBe("Creative");
    expect(updated.columns[0]?.name).toBe(board.columns[0]?.name);
  });

  it("adds a card to the requested column", () => {
    const board = initialBoardState();

    const updated = addCard(board, "column-build", {
      id: "card-test",
      title: "Ship the shell",
      details: "Finish the responsive board treatment.",
    });

    expect(updated.columns[2]?.cards.at(-1)?.title).toBe("Ship the shell");
    expect(updated.columns[2]?.cards).toHaveLength(board.columns[2]!.cards.length + 1);
  });

  it("deletes the selected card", () => {
    const board = initialBoardState();
    const column = board.columns[0]!;
    const card = column.cards[0]!;

    const updated = deleteCard(board, column.id, card.id);

    expect(updated.columns[0]?.cards.find((item) => item.id === card.id)).toBeUndefined();
  });

  it("moves a card to another column", () => {
    const board = initialBoardState();
    const sourceCard = board.columns[0]!.cards[0]!;

    const updated = moveCard(board, sourceCard.id, null, "column-launch");

    expect(updated.columns[0]?.cards.find((item) => item.id === sourceCard.id)).toBeUndefined();
    expect(updated.columns[4]?.cards.find((item) => item.id === sourceCard.id)).toBeDefined();
  });

  it("reorders a card within the same column", () => {
    const board = initialBoardState();
    const first = board.columns[0]!.cards[0]!;
    const second = board.columns[0]!.cards[1]!;

    const updated = moveCard(board, second.id, first.id, null);

    expect(updated.columns[0]?.cards[0]?.id).toBe(second.id);
  });
});
