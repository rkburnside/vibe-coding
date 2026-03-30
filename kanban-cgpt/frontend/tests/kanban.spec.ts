import { expect, test } from "@playwright/test";

test("supports column rename, card creation, and drag/drop", async ({ page }) => {
  await page.goto("/");

  const designName = page.locator("#column-design-name");
  await designName.fill("Creative");
  await expect(designName).toHaveValue("Creative");

  await page.getByLabel("New card title for Build").fill("Finish smoke test");
  await page
    .getByLabel("New card details for Build")
    .fill("Run the final walkthrough before sharing the MVP.");
  await page
    .locator("section[data-column-id='column-build']")
    .getByRole("button", { name: "Create card" })
    .click();
  await expect(page.getByText("Finish smoke test")).toBeVisible();

  const sourceCard = page.locator("[data-card-id='card-content-check']");
  const targetColumn = page.locator("section[data-column-id='column-launch']");

  await sourceCard.hover();
  const sourceBox = await sourceCard.boundingBox();
  const targetBox = await targetColumn.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error("Could not resolve drag/drop bounds.");
  }

  await page.mouse.move(
    sourceBox.x + sourceBox.width / 2,
    sourceBox.y + sourceBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + 140, {
    steps: 12,
  });
  await page.mouse.up();

  await expect(
    page.locator("section[data-column-id='column-launch']").getByText("Content QA"),
  ).toBeVisible();
});
