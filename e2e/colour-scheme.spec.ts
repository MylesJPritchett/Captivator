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
});
