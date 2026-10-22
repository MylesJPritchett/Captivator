import { expect, test } from "@playwright/test";

test("a second, renamed Splash Page is still in the Library and open with its edit after a reload", async ({
  page,
}) => {
  await page.goto("/");
  const library = page.getByRole("navigation", { name: "Library" });
  const editor = page.getByRole("region", { name: "Editor" });
  const preview = page.getByRole("region", { name: "Preview" });

  await library.getByRole("button", { name: "New Splash Page" }).click();
  const name = editor.getByRole("textbox", { name: "Name" });
  await expect(name).toBeFocused();
  await name.fill("Corner Café");
  await editor
    .getByRole("textbox", { name: "Text Block 1 text" })
    .fill("Welcome to the Café");
  await expect(preview.getByText("Welcome to the Café")).toBeVisible();

  await page.reload();

  await expect(library.getByRole("listitem")).toHaveText([
    "My Splash Page",
    "Corner Café",
  ]);
  await expect(
    library.getByRole("button", { name: "Corner Café" }),
  ).toHaveAttribute("aria-current", "true");
  await expect(name).toHaveValue("Corner Café");
  await expect(preview.getByText("Welcome to the Café")).toBeVisible();
});

test("a long name is shortened in the Library without widening it", async ({
  page,
}) => {
  await page.goto("/");
  const library = page.getByRole("navigation", { name: "Library" });
  const longName =
    "The Corner Café on the High Street, with Free WiFi for Every Guest Who Visits";

  await page
    .getByRole("region", { name: "Editor" })
    .getByRole("textbox", { name: "Name" })
    .fill(longName);

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
