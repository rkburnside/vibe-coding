import { expect, test, type Page } from "@playwright/test";

test("supports the main Kanban workflow", async ({ page }) => {
  await page.goto("/");

  const briefColumn = page.getByTestId("column-brief");
  const shapeColumn = page.getByTestId("column-shape");

  await briefColumn.getByLabel("Column name").fill("Strategy");
  await briefColumn.getByLabel("Column name").blur();
  await expect(
    page.getByRole("region", {
      name: "Strategy column",
    }),
  ).toBeVisible();

  await briefColumn.getByRole("button", { name: "New card" }).click();

  const composer = page.getByTestId("composer-brief");
  await composer.getByLabel("Card title").fill("Prepare board walkthrough");
  await composer
    .getByLabel("Card details")
    .fill("Outline the quick demo so the handoff stays tight and visual.");
  await composer.getByRole("button", { name: "Add card" }).click();

  await expect(briefColumn.getByText("Prepare board walkthrough")).toBeVisible();

  await dragCardToColumn(page, "Prepare board walkthrough", "shape");

  await expect(shapeColumn.getByText("Prepare board walkthrough")).toBeVisible();

  await shapeColumn
    .getByRole("button", { name: "Delete Prepare board walkthrough" })
    .click();
  await expect(shapeColumn.getByText("Prepare board walkthrough")).toHaveCount(0);
});

test("keeps the board usable on mobile widths", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const launchColumn = page.getByTestId("column-launch");
  await launchColumn.scrollIntoViewIfNeeded();
  await expect(launchColumn).toBeVisible();

  await launchColumn.getByRole("button", { name: "New card" }).click();

  const composer = page.getByTestId("composer-launch");
  await composer.getByLabel("Card title").fill("Publish launch memo");
  await composer
    .getByLabel("Card details")
    .fill("Capture the release notes and send the link to the team.");
  await composer.getByRole("button", { name: "Add card" }).click();

  await expect(launchColumn.getByText("Publish launch memo")).toBeVisible();
});

async function dragCardToColumn(
  page: Page,
  cardTitle: string,
  columnId: string,
) {
  const handle = page.getByRole("button", { name: `Drag ${cardTitle}` });
  const dropzone = page.getByTestId(`column-dropzone-${columnId}`);

  await handle.scrollIntoViewIfNeeded();
  await dropzone.scrollIntoViewIfNeeded();

  const handleBox = await handle.boundingBox();
  const dropzoneBox = await dropzone.boundingBox();

  if (!handleBox || !dropzoneBox) {
    throw new Error("Unable to resolve drag coordinates.");
  }

  await page.mouse.move(
    handleBox.x + handleBox.width / 2,
    handleBox.y + handleBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    dropzoneBox.x + dropzoneBox.width / 2,
    dropzoneBox.y + Math.min(dropzoneBox.height / 2, 220),
    { steps: 24 },
  );
  await page.mouse.up();
}
