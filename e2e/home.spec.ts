// PLACEHOLDER: throwaway test proving the Playwright browser layer works.
// Delete this file once the first real E2E test (e.g. the Device toggle) exists.
import { expect, test } from "@playwright/test";

test("starter home page loads (placeholder)", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: /to get started/i }),
  ).toBeVisible();
});
