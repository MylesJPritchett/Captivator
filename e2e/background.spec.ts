import path from "node:path";
import { expect, test, type Locator } from "@playwright/test";

// A real 1200×800 PNG: a plain green stand-in for a photo of the venue.
const venuePhoto = path.join(__dirname, "fixtures", "venue.png");

async function expectToFill(background: Locator, frame: Locator) {
  const backgroundBox = await background.boundingBox();
  const frameBox = await frame.boundingBox();
  if (!backgroundBox || !frameBox) throw new Error("Preview not rendered");
  // Everything inside the frame's bezel.
  expect(backgroundBox.width).toBeGreaterThan(frameBox.width * 0.9);
  expect(backgroundBox.height).toBeGreaterThan(frameBox.height * 0.9);
}

test("uploading a real image as the Background renders it filling both Device frames", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.getByRole("region", { name: "Editor" });
  const preview = page.getByRole("region", { name: "Preview" });

  await editor.getByLabel("Background image").setInputFiles(venuePhoto);

  const background = preview.getByRole("group", { name: "Background" });
  const imageUrl = await background.evaluate((element) => {
    const match = /url\("(.+)"\)/.exec(
      getComputedStyle(element).backgroundImage,
    );
    return match?.[1];
  });
  expect(imageUrl).toMatch(/^blob:/);
  // The browser can decode the image behind that URL, so it really renders.
  const naturalWidth = await page.evaluate(async (url) => {
    const image = new Image();
    image.src = url!;
    await image.decode();
    return image.naturalWidth;
  }, imageUrl);
  expect(naturalWidth).toBe(1200);
  await expectToFill(
    background,
    preview.getByRole("figure", { name: "Mobile Preview" }),
  );

  await page.getByRole("radio", { name: "Desktop" }).check();

  await expectToFill(
    background,
    preview.getByRole("figure", { name: "Desktop Preview" }),
  );
});
