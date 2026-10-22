import { expect, test, type Locator, type Page } from "@playwright/test";

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
 * The colours an element, or one of its pseudo-elements, is drawn in: its text
 * colour, its accent colour (`auto` when left to the browser), and the first
 * opaque background behind it (its own, else its nearest ancestor's).
 */
async function colours(element: Locator, pseudoElement?: string) {
  return element.evaluate((start, pseudo) => {
    const isOpaque = (colour: string) =>
      colour !== "transparent" && !/rgba\(.*,\s*0\)$/.test(colour);
    const own = getComputedStyle(start, pseudo);
    const layers = [own.backgroundColor];
    // A pseudo-element sits on its element, so walk up from the element.
    let node: Element | null = pseudo ? start : start.parentElement;
    for (; node; node = node.parentElement) {
      layers.push(getComputedStyle(node).backgroundColor);
    }
    const background = layers.find(isOpaque) ?? "rgb(255, 255, 255)";
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
      text: toRgb(own.color),
      accent: own.accentColor === "auto" ? "auto" : toRgb(own.accentColor),
      background: toRgb(background),
    };
  }, pseudoElement);
}

for (const colorScheme of ["light", "dark"] as const) {
  test(`every Editor button is drawn alike in a ${colorScheme} colour scheme`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    const editor = page.getByRole("region", { name: "Editor" });
    const addTextBlock = await colours(
      editor.getByRole("button", { name: "Add Text Block" }),
    );
    for (const name of ["Add Input Field", "Reset to starter"]) {
      expect(await colours(editor.getByRole("button", { name })), name).toEqual(
        addTextBlock,
      );
    }
  });
}

test.describe("with a dark colour scheme", () => {
  test.use({ colorScheme: "dark" });

  test("the Editor is dark and its file inputs and sliders are readable", async ({
    page,
  }) => {
    await page.goto("/");

    const pageBackground = await page
      .locator("body")
      .evaluate((body) => getComputedStyle(body).backgroundColor);
    expect(luminance(pageBackground)).toBeLessThan(0.1);

    const editor = page.getByRole("region", { name: "Editor" });
    for (const label of ["Logo image", "Background image"]) {
      const { text, background } = await colours(
        editor.getByLabel(label),
        "::file-selector-button",
      );
      expect(contrast(text, background), label).toBeGreaterThanOrEqual(4.5);
    }

    // A slider's fill is drawn in its accent colour; the browser's default
    // needn't suit the Editor's colours.
    const { accent, background } = await colours(
      editor.getByLabel("Text Block 1 size"),
    );
    expect(accent).not.toBe("auto");
    expect(contrast(accent, background)).toBeGreaterThanOrEqual(3);
  });

  test("the Editor's buttons stay readable while hovered", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "touch screens have no hover");
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

  test("the Device toggle is dark, with readable options", async ({ page }) => {
    await page.goto("/");
    const options = page
      .getByRole("group", { name: "Device" })
      .locator("label");
    await expect(options).not.toHaveCount(0);
    for (const option of await options.all()) {
      const { text, background } = await colours(option);
      expect(luminance(background)).toBeLessThan(0.2);
      expect(contrast(text, background)).toBeGreaterThanOrEqual(4.5);
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

test("the Preview's Splash Page renders the same whatever the colour scheme or Appearance", async ({
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
  // Choosing an Appearance scrolls up to the page header; scroll back first.
  const scrollY = await page.evaluate(() => window.scrollY);
  const shoot = async () => {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    return page.screenshot({ clip, animations: "disabled" });
  };

  await page.emulateMedia({ colorScheme: "light" });
  const light = await shoot();
  await page.emulateMedia({ colorScheme: "dark" });
  const dark = await shoot();

  expect(dark.equals(light)).toBe(true);

  // Nor does the Customer's Appearance, against either colour scheme.
  await chooseAppearance(page, "Light");
  const lightAppearance = await shoot();
  await page.emulateMedia({ colorScheme: "light" });
  await chooseAppearance(page, "Dark");
  const darkAppearance = await shoot();

  expect(lightAppearance.equals(light)).toBe(true);
  expect(darkAppearance.equals(light)).toBe(true);
  // Playwright hides scrollbars, so the screenshots can't show the Splash
  // Page's own native parts, like its scrollbar. Those follow its declared
  // colour scheme, which must stay light.
  await expect(splashPage).toHaveCSS("color-scheme", "light");
});

/** The page's and an Editor button's backgrounds, the Editor's text colour. */
async function editorColours(page: Page) {
  const editor = page.getByRole("region", { name: "Editor" });
  const pageBackground = await page
    .locator("body")
    .evaluate((body) => getComputedStyle(body).backgroundColor);
  const button = await colours(
    editor.getByRole("button", { name: "Add Text Block" }),
  );
  const heading = await colours(
    editor.getByRole("heading", { name: "Editor" }),
  );
  return { pageBackground, button: button.background, text: heading.text };
}

function chooseAppearance(page: Page, name: "Light" | "System" | "Dark") {
  return page
    .getByRole("group", { name: "Appearance" })
    .getByRole("radio", { name })
    .check();
}

test("choosing Dark Appearance makes the Editor and the Device toggle dark in a light colour scheme", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  await chooseAppearance(page, "Dark");

  const { pageBackground, button, text } = await editorColours(page);
  expect(luminance(pageBackground)).toBeLessThan(0.1);
  expect(luminance(button)).toBeLessThan(0.1);
  expect(luminance(text)).toBeGreaterThan(0.5);
  const deviceOptions = page
    .getByRole("group", { name: "Device" })
    .locator("label");
  await expect(deviceOptions).not.toHaveCount(0);
  for (const option of await deviceOptions.all()) {
    expect(luminance((await colours(option)).background)).toBeLessThan(0.2);
  }
});

test("choosing Light Appearance makes the Editor light in a dark colour scheme", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  await chooseAppearance(page, "Light");

  const { pageBackground, button, text } = await editorColours(page);
  expect(luminance(pageBackground)).toBeGreaterThan(0.9);
  expect(luminance(button)).toBeGreaterThan(0.9);
  expect(luminance(text)).toBeLessThan(0.1);
});

test("on System Appearance the Editor follows a change to the colour scheme while open", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await chooseAppearance(page, "Dark");
  await chooseAppearance(page, "System");
  expect(luminance((await editorColours(page)).pageBackground)).toBeGreaterThan(
    0.9,
  );

  await page.emulateMedia({ colorScheme: "dark" });

  expect(luminance((await editorColours(page)).pageBackground)).toBeLessThan(
    0.1,
  );
});

for (const [chosen, colorScheme] of [
  ["Dark", "light"],
  ["Light", "dark"],
] as const) {
  test(`a chosen ${chosen} Appearance survives a reload, applied before Captivator's scripts run`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    await chooseAppearance(page, chosen);
    const { pageBackground } = await editorColours(page);

    await page.reload();

    await expect(
      page
        .getByRole("group", { name: "Appearance" })
        .getByRole("radio", { name: chosen }),
    ).toBeChecked();
    expect((await editorColours(page)).pageBackground).toBe(pageBackground);

    // With Captivator's scripts blocked, only the server's HTML and its inline
    // script run: what shows then is what's painted before hydration, so a
    // match here means no flash of the other colour scheme.
    await page.route("**/_next/static/**/*.js", (route) => route.abort());
    await page.reload();
    const firstPaintBackground = await page
      .locator("body")
      .evaluate((body) => getComputedStyle(body).backgroundColor);
    expect(firstPaintBackground).toBe(pageBackground);
  });
}
