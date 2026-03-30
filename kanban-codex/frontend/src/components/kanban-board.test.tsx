import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { KanbanBoard } from "./kanban-board";

describe("KanbanBoard", () => {
  it("renames a column on blur", async () => {
    const user = userEvent.setup();

    render(<KanbanBoard />);

    const column = screen.getByTestId("column-brief");
    const input = within(column).getByLabelText("Column name");

    await user.clear(input);
    await user.type(input, "Strategy");
    await user.tab();

    expect(input).toHaveValue("Strategy");
    expect(
      await screen.findByRole("region", {
        name: "Strategy column",
      }),
    ).toBeInTheDocument();
  });

  it("adds and deletes a card within a column", async () => {
    const user = userEvent.setup();

    render(<KanbanBoard />);

    const column = screen.getByTestId("column-build");

    await user.click(within(column).getByRole("button", { name: "New card" }));

    const composer = within(column).getByTestId("composer-build");

    await user.type(within(composer).getByLabelText("Card title"), "Ship animation polish");
    await user.type(
      within(composer).getByLabelText("Card details"),
      "Smooth the lift and drop states before the board demo.",
    );
    await user.click(within(composer).getByRole("button", { name: "Add card" }));

    expect(within(column).getByText("Ship animation polish")).toBeInTheDocument();

    await user.click(
      within(column).getByRole("button", {
        name: "Delete Ship animation polish",
      }),
    );

    expect(within(column).queryByText("Ship animation polish")).not.toBeInTheDocument();
  });
});
