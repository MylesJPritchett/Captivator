import { expect, test } from "@playwright/test";

test("on narrow screens the Library button shows the Library, and a new Splash Page opens", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Wide screens always show the Library");
  await page.goto("/");
  const libraryButton = page.getByRole("button", { name: "Library" });
  const library = page.getByRole("navigation", { name: "Library" });
  await expect(library).toBeHidden();

  await libraryButton.click();
  await expect(libraryButton).toHaveAttribute("aria-expanded", "true");
  await library.getByRole("button", { name: "New Splash Page" }).click();

  await expect(library).toBeHidden();
  await libraryButton.click();
  await expect(
    library.getByRole("button", { name: "Untitled Splash Page" }),
  ).toHaveAttribute("aria-current", "true");
});

test("on wide screens the Library stays in place as the Editor scrolls, and a long Library scrolls inside its column", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Narrow screens hide the Library behind a button");
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Library" })).toBeHidden();
  const library = page.getByRole("navigation", { name: "Library" });
  const newSplashPage = library.getByRole("button", {
    name: "New Splash Page",
  });
  for (let i = 0; i < 30; i++) await newSplashPage.click();
  await expect(
    library.getByRole("button", { name: "Untitled Splash Page" }),
  ).toHaveCount(30);

  // Scroll the page to the end of the Editor.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeGreaterThan(0);

  const viewport = page.viewportSize()!;
  const top = await newSplashPage.boundingBox();
  if (!top) throw new Error("Library not rendered");
  expect(top.y).toBeGreaterThanOrEqual(0);
  expect(top.y + top.height).toBeLessThanOrEqual(viewport.height);

  // The list is longer than the screen, and scrolls inside the Library column
  // rather than scrolling the page.
  const last = library
    .getByRole("button", { name: "Untitled Splash Page" })
    .last();
  const below = await last.boundingBox();
  expect(below!.y).toBeGreaterThan(viewport.height);
  await last.scrollIntoViewIfNeeded();
  const shown = await last.boundingBox();
  expect(shown!.y + shown!.height).toBeLessThanOrEqual(viewport.height);
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
});
