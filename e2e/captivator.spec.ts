import { expect, test } from "@playwright/test";

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

test("choosing Desktop swaps the tall phone frame for a wide frame with a centred column", async ({
  page,
}) => {
  await page.goto("/");
  const preview = page.getByRole("region", { name: "Preview" });

  const mobile = await preview
    .getByRole("figure", { name: "Mobile Preview" })
    .boundingBox();
  if (!mobile) throw new Error("Mobile frame not rendered");
  expect(mobile.height).toBeGreaterThan(mobile.width);

  await page.getByRole("radio", { name: "Desktop" }).check();

  const desktopFrame = preview.getByRole("figure", { name: "Desktop Preview" });
  const desktop = await desktopFrame.boundingBox();
  if (!desktop) throw new Error("Desktop frame not rendered");
  expect(desktop.width).toBeGreaterThan(desktop.height);

  // The content sits in a narrow column centred in the frame.
  const connect = await desktopFrame
    .getByRole("button", { name: "Connect" })
    .boundingBox();
  if (!connect) throw new Error("Connect Button not rendered");
  expect(connect.width).toBeLessThan(desktop.width / 2);
  expect(
    Math.abs(connect.x + connect.width / 2 - (desktop.x + desktop.width / 2)),
  ).toBeLessThan(4);

  // The Background fills the frame, not only the column.
  const backgroundNearEdge = await page.evaluate(
    ([x, y]) => {
      let element = document.elementFromPoint(x, y);
      while (element) {
        const colour = getComputedStyle(element).backgroundColor;
        if (colour !== "rgba(0, 0, 0, 0)") return colour;
        element = element.parentElement;
      }
      return null;
    },
    [desktop.x + desktop.width * 0.1, desktop.y + desktop.height * 0.85],
  );
  expect(backgroundNearEdge).toBe("rgb(30, 58, 138)");

  // The scaled Desktop screen never widens the page.
  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  expect(scrollWidth).toBeLessThanOrEqual(page.viewportSize()!.width);

  await page.getByRole("radio", { name: "Mobile" }).check();
  await expect(
    preview.getByRole("figure", { name: "Mobile Preview" }),
  ).toBeVisible();
});
