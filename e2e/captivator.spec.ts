import { expect, test } from "@playwright/test";

test("the Preview shows the starter Splash Page", async ({ page }) => {
  await page.goto("/");

  const preview = page.getByRole("region", { name: "Preview" });
  await expect(preview.getByText("Free WiFi")).toBeVisible();
  await expect(preview.getByRole("textbox", { name: "Email" })).toBeVisible();
  await expect(preview.getByRole("button", { name: "Connect" })).toBeVisible();
});

test("the Preview sits above the Editor on narrow screens and beside it on wide ones", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");

  const preview = await page
    .getByRole("region", { name: "Preview" })
    .boundingBox();
  const editor = await page
    .getByRole("region", { name: "Editor" })
    .boundingBox();
  if (!preview || !editor) throw new Error("Preview or Editor not rendered");

  if (isMobile) {
    expect(editor.y).toBeGreaterThanOrEqual(preview.y + preview.height);
  } else {
    expect(editor.x).toBeGreaterThanOrEqual(preview.x + preview.width);
  }
  // No horizontal scrolling on either screen size.
  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  expect(scrollWidth).toBeLessThanOrEqual(page.viewportSize()!.width);
});
