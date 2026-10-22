import path from "node:path";
import { expect, test } from "@playwright/test";

// A real 1200×800 PNG, much bigger than the Logo is allowed to show.
const largeLogo = path.join(__dirname, "fixtures", "logo.png");

test("uploading a real image shows it as the Logo, kept to a maximum size", async ({
  page,
}) => {
  await page.goto("/");

  await page
    .getByRole("region", { name: "Editor" })
    .getByLabel("Logo image")
    .setInputFiles(largeLogo);

  const logo = page
    .getByRole("region", { name: "Preview" })
    .getByRole("img", { name: "Logo" });
  await expect(logo).toBeVisible();
  // The browser decoded the image, so it's really rendering.
  expect(
    await logo.evaluate((image: HTMLImageElement) => image.naturalWidth),
  ).toBe(1200);
  const box = await logo.boundingBox();
  if (!box) throw new Error("Logo not rendered");
  expect(box.width).toBeLessThanOrEqual(200);
  expect(box.height).toBeLessThanOrEqual(120);
});
