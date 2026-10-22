import path from "node:path";
import { expect, test } from "@playwright/test";

const logoFile = path.join(__dirname, "fixtures", "logo.png");

test("an uploaded Logo and an edited Text Block are still shown after a reload", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.getByRole("region", { name: "Editor" });
  const preview = page.getByRole("region", { name: "Preview" });

  await editor.getByLabel("Logo image").setInputFiles(logoFile);
  await expect(preview.getByRole("img", { name: "Logo" })).toBeVisible();
  await editor
    .getByRole("textbox", { name: "Text Block 1 text" })
    .fill("Welcome to the Café");
  await expect(preview.getByText("Welcome to the Café")).toBeVisible();

  await page.reload();

  const logo = preview.getByRole("img", { name: "Logo" });
  await expect(logo).toBeVisible();
  // The browser decoded the remembered image, so it's really rendering.
  expect(
    await logo.evaluate((image: HTMLImageElement) => image.naturalWidth),
  ).toBe(1200);
  await expect(preview.getByText("Welcome to the Café")).toBeVisible();
  await expect(preview.getByText("Free WiFi")).toHaveCount(0);
});
