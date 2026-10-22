import { expect, test, type Locator } from "@playwright/test";

/** Relative luminance of a computed `rgb()`/`rgba()` colour, 0 (black) to 1. */
function luminance(colour: string): number {
  const [r, g, b] = (colour.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
  const linear = (channel: number) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** WCAG contrast ratio between two computed colours, 1 to 21. */
function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/**
 * The colours an element is drawn in: its text colour, and the first opaque
 * background behind it (its own, else its nearest ancestor's).
 */
async function colours(element: Locator) {
  return element.evaluate((start) => {
    const isOpaque = (colour: string) =>
      colour !== "transparent" && !/rgba\(.*,\s*0\)$/.test(colour);
    let background = "rgb(255, 255, 255)";
    for (let node: Element | null = start; node; node = node.parentElement) {
      const own = getComputedStyle(node).backgroundColor;
      if (isOpaque(own)) {
        background = own;
        break;
      }
    }
    // Tailwind's palette computes to `lab()`/`oklch()`; paint each colour to
    // read it back as sRGB.
    const context = document.createElement("canvas").getContext("2d", {
      willReadFrequently: true,
    })!;
    const toRgb = (colour: string) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = colour;
      context.fillRect(0, 0, 1, 1);
      const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
      return `rgb(${r}, ${g}, ${b})`;
    };
    return {
      text: toRgb(getComputedStyle(start).color),
      background: toRgb(background),
    };
  });
}

/**
 * The colours a file input's button is drawn in: its text colour, and the
 * first opaque background behind it (its own, else its nearest ancestor's).
 */
async function fileButtonColours(fileInput: Locator) {
  return fileInput.evaluate((input) => {
    const button = getComputedStyle(input, "::file-selector-button");
    const isOpaque = (colour: string) =>
      colour !== "transparent" && !/rgba\(.*,\s*0\)$/.test(colour);
    let background = button.backgroundColor;
    let element: Element | null = input;
    while (!isOpaque(background) && element) {
      background = getComputedStyle(element).backgroundColor;
      element = element.parentElement;
    }
    return { text: button.color, background };
  });
}

test.describe("with a dark colour scheme", () => {
  test.use({ colorScheme: "dark" });

  test("the Editor is dark and its image file inputs are readable", async ({
    page,
  }) => {
    await page.goto("/");

    const pageBackground = await page
      .locator("body")
      .evaluate((body) => getComputedStyle(body).backgroundColor);
    expect(luminance(pageBackground)).toBeLessThan(0.1);

    const editor = page.getByRole("region", { name: "Editor" });
    for (const label of ["Logo image", "Background image"]) {
      const { text, background } = await fileButtonColours(
        editor.getByLabel(label),
      );
      expect(contrast(text, background), label).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("the Editor's buttons stay readable while hovered", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "touch Devices have no hover");
    await page.goto("/");
    const editor = page.getByRole("region", { name: "Editor" });
    for (const name of [
      "Add Text Block",
      "Remove Text Block 1",
      "Add Input Field",
      "Reset to starter",
    ]) {
      const button = editor.getByRole("button", { name });
      await button.hover();
      const { text, background } = await colours(button);
      expect(contrast(text, background), name).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("a disabled Editor button looks disabled yet stays legible", async ({
    page,
  }) => {
    await page.goto("/");
    const button = page
      .getByRole("region", { name: "Editor" })
      .getByRole("button", { name: "Add Text Block" });
    const enabled = await colours(button);
    // No Editor button is disabled today; disable one to check the shared
    // disabled style that any of them would get.
    await button.evaluate((element) => element.setAttribute("disabled", ""));
    const disabled = await colours(button);

    expect(disabled.text).not.toBe(enabled.text);
    expect(contrast(disabled.text, disabled.background)).toBeGreaterThanOrEqual(
      3,
    );
  });

  test("the Editor's status and error messages are readable", async ({
    page,
  }) => {
    await page.goto("/");
    const editor = page.getByRole("region", { name: "Editor" });
    await editor.getByLabel("Logo image").setInputFiles({
      name: "notes.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("not an image"),
    });

    for (const message of [
      editor.getByText("Your design is saved in this browser."),
      editor.getByRole("alert"),
    ]) {
      const { text, background } = await colours(message);
      expect(contrast(text, background)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

test("the Preview's Splash Page renders the same whatever the colour scheme", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.getByRole("region", { name: "Editor" });
  const splashPage = page
    .getByRole("region", { name: "Preview" })
    .getByRole("group", { name: "Background" });
  // The starter Splash Page has an Input Field, which could pick up dark
  // native styling.
  await expect(splashPage.getByRole("textbox")).not.toHaveCount(0);
  // Enough text to overflow the Device, so the Splash Page shows a scrollbar.
  await editor
    .getByLabel("Text Block 1 text")
    .fill("Welcome to our venue, enjoy the free WiFi. ".repeat(12));
  await editor.getByLabel("Text Block 1 size").fill("64");
  await expect
    .poll(() =>
      splashPage.evaluate(
        (element) => element.scrollHeight > element.clientHeight,
      ),
    )
    .toBe(true);

  // Inset a little: the box's fractional edges let through the page around
  // the Device frame, which does follow the colour scheme.
  await splashPage.scrollIntoViewIfNeeded();
  const box = await splashPage.boundingBox();
  if (!box) throw new Error("Splash Page not rendered");
  const clip = {
    x: Math.ceil(box.x) + 1,
    y: Math.ceil(box.y) + 1,
    width: Math.floor(box.width) - 2,
    height: Math.floor(box.height) - 2,
  };
  const shoot = () => page.screenshot({ clip, animations: "disabled" });

  await page.emulateMedia({ colorScheme: "light" });
  const light = await shoot();
  await page.emulateMedia({ colorScheme: "dark" });
  const dark = await shoot();

  expect(dark.equals(light)).toBe(true);
  // Playwright hides scrollbars, so the screenshots can't show the Splash
  // Page's own native parts, like its scrollbar. Those follow its declared
  // colour scheme, which must stay light.
  await expect(splashPage).toHaveCSS("color-scheme", "light");
});
