import { expect, test, type Page } from "@playwright/test";

/** Shows the Library, which narrow screens hide behind a button. */
async function showLibrary(page: Page, isMobile: boolean) {
  if (isMobile) await page.getByRole("button", { name: "Library" }).click();
}

test("a second, renamed Splash Page is still in the Library and open with its edit after a reload", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  const library = page.getByRole("navigation", { name: "Library" });
  const editor = page.getByRole("region", { name: "Editor" });
  const preview = page.getByRole("region", { name: "Preview" });

  await showLibrary(page, isMobile);
  await library.getByRole("button", { name: "New Splash Page" }).click();
  const name = editor.getByRole("textbox", { name: "Name" });
  await expect(name).toBeFocused();
  await name.fill("Corner Café");
  await editor
    .getByRole("textbox", { name: "Text Block 1 text" })
    .fill("Welcome to the Café");
  await expect(preview.getByText("Welcome to the Café")).toBeVisible();

  await page.reload();

  await expect(name).toHaveValue("Corner Café");
  await showLibrary(page, isMobile);
  await expect(library.getByRole("listitem")).toHaveText([
    "My Splash Page",
    "Corner Café",
  ]);
  await expect(
    library.getByRole("button", { name: "Corner Café" }),
  ).toHaveAttribute("aria-current", "true");
  await expect(preview.getByText("Welcome to the Café")).toBeVisible();
});

test("a long name is shortened in the Library without widening it", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  const library = page.getByRole("navigation", { name: "Library" });
  const longName =
    "The Corner Café on the High Street, with Free WiFi for Every Guest Who Visits";

  await page
    .getByRole("region", { name: "Editor" })
    .getByRole("textbox", { name: "Name" })
    .fill(longName);
  await showLibrary(page, isMobile);

  const button = library.getByRole("button", { name: longName });
  await expect(button).toBeVisible();
  // The name is cut off on one line rather than wrapping or overflowing.
  const fits = await button.evaluate((element) => ({
    cutOff: element.scrollWidth > element.clientWidth,
    oneLine:
      element.clientHeight <
      2 * parseFloat(getComputedStyle(element).lineHeight),
    ellipsis: getComputedStyle(element).textOverflow === "ellipsis",
  }));
  expect(fits).toEqual({ cutOff: true, oneLine: true, ellipsis: true });
  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  expect(scrollWidth).toBeLessThanOrEqual(page.viewportSize()!.width);
});

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
