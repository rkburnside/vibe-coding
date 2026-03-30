import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { KanbanBoard } from "@/components/kanban-board";

describe("KanbanBoard", () => {
  it("renders the five seeded columns", () => {
    render(<KanbanBoard />);

    expect(screen.getByDisplayValue("Strategy")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Design")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Build")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Review")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Launch")).toBeInTheDocument();
  });

  it("lets the user rename a column", async () => {
    render(<KanbanBoard />);

    const input = screen.getByDisplayValue("Design");
    fireEvent.change(input, { target: { value: "Creative" } });

    expect(input).toHaveValue("Creative");
  });

  it("adds a card to a column", async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    await user.type(
      screen.getByLabelText("New card title for Build"),
      "Hook up release prep",
    );
    await user.type(
      screen.getByLabelText("New card details for Build"),
      "Capture the final checklist before handoff.",
    );
    await user.click(screen.getAllByRole("button", { name: "Create card" })[2]!);

    expect(screen.getByText("Hook up release prep")).toBeInTheDocument();
  });

  it("deletes a card from the board", async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    await user.click(screen.getByRole("button", { name: "Delete Prepare demo script" }));

    expect(screen.queryByText("Prepare demo script")).not.toBeInTheDocument();
  });
});
