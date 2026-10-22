import { cleanup, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  editTextBlock1,
  imageDataUrl,
  renderCaptivator,
  savedSplashPageKey,
  seedSavedSplashPage,
} from "@/app/test-helpers";
import type { SplashPage } from "@/splash-page";

/** A Splash Page far from the Starter Splash Page, images and all. */
const savedSplashPage: SplashPage = {
  logo: imageDataUrl("cafe-logo.png"),
  background: {
    kind: "image",
    colour: "#000000",
    imageUrl: imageDataUrl("venue.png"),
  },
  textBlocks: [
    {
      id: "saved-text-block",
      text: "Welcome to the Café",
      colour: "#ff0000",
      size: 48,
    },
  ],
  inputFields: [{ type: "Name" }, { type: "Phone" }],
  connectButton: { backgroundColour: "#00ff00", textColour: "#000000" },
};

/** The key one version before `key`, e.g. "….v0" for "….v1". */
function olderVersionKey(key: string) {
  return key.replace(/\.v(\d+)$/, (_, version) => `.v${Number(version) - 1}`);
}

describe("Captivator: remembering the Splash Page in this browser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("an edited Text Block is still shown in the Preview after Captivator is rendered again", async () => {
    const user = userEvent.setup();
    const { editor } = await renderCaptivator();
    await editTextBlock1(user, editor, "Welcome to the Café");

    cleanup();
    const { preview } = await renderCaptivator();

    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
    expect(within(preview).queryByText("Free WiFi")).not.toBeInTheDocument();
  });

  it("a saved Splash Page opens in the Preview, including its Logo and Background image", async () => {
    seedSavedSplashPage(savedSplashPage);

    const { preview, background } = await renderCaptivator();

    expect(within(preview).getByRole("img", { name: "Logo" })).toHaveAttribute(
      "src",
      imageDataUrl("cafe-logo.png"),
    );
    expect(background()).toHaveStyle({
      backgroundImage: `url("${imageDataUrl("venue.png")}")`,
    });
    expect(within(preview).getByText("Welcome to the Café")).toHaveStyle({
      color: "#ff0000",
      fontSize: "48px",
    });
    expect(
      within(preview).getByRole("textbox", { name: "Phone" }),
    ).toBeInTheDocument();
    expect(within(preview).queryByText("Free WiFi")).not.toBeInTheDocument();
  });

  it.each([
    ["isn't JSON", "{not json"],
    ["isn't a Splash Page", JSON.stringify({ textBlocks: "Free WiFi" })],
    [
      "has a Text Block missing its size",
      JSON.stringify({
        ...savedSplashPage,
        textBlocks: [{ id: "t", text: "Welcome to the Café", colour: "#fff" }],
      }),
    ],
    [
      "has more than two Input Fields",
      JSON.stringify({
        ...savedSplashPage,
        inputFields: [{ type: "Name" }, { type: "Email" }, { type: "Phone" }],
      }),
    ],
    [
      "has two Input Fields of the same type",
      JSON.stringify({
        ...savedSplashPage,
        inputFields: [{ type: "Email" }, { type: "Email" }],
      }),
    ],
  ])(
    "a saved Splash Page that %s opens the Preview on the Starter Splash Page",
    async (_, saved) => {
      localStorage.setItem(savedSplashPageKey, saved);

      const { preview } = await renderCaptivator();

      expect(within(preview).getByText("Free WiFi")).toBeInTheDocument();
      expect(
        within(preview).queryByRole("img", { name: "Logo" }),
      ).not.toBeInTheDocument();
    },
  );

  it("a Splash Page saved under an older version opens the Preview on the Starter Splash Page", async () => {
    localStorage.setItem(
      olderVersionKey(savedSplashPageKey),
      JSON.stringify(savedSplashPage),
    );

    const { preview } = await renderCaptivator();

    expect(within(preview).getByText("Free WiFi")).toBeInTheDocument();
    expect(
      within(preview).queryByText("Welcome to the Café"),
    ).not.toBeInTheDocument();
  });

  it("with nothing saved, Captivator opens on the Starter Splash Page", async () => {
    const { preview } = await renderCaptivator();

    expect(within(preview).getByText("Free WiFi")).toBeInTheDocument();
    expect(
      within(preview).getByRole("textbox", { name: "Email" }),
    ).toBeInTheDocument();
  });

  it("a Background switched to image before uploading one is still remembered after Captivator is rendered again", async () => {
    const user = userEvent.setup();
    const { editor } = await renderCaptivator();
    await editTextBlock1(user, editor, "Welcome to the Café");
    await user.click(within(editor).getByRole("radio", { name: "Image" }));

    cleanup();
    const { preview } = await renderCaptivator();

    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
  });

  it("a removed Logo stays removed after Captivator is rendered again", async () => {
    const user = userEvent.setup();
    seedSavedSplashPage(savedSplashPage);
    const { editor } = await renderCaptivator();

    await user.click(
      within(editor).getByRole("button", { name: "Remove Logo" }),
    );
    cleanup();
    const { preview } = await renderCaptivator();

    expect(
      within(preview).queryByRole("img", { name: "Logo" }),
    ).not.toBeInTheDocument();
    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
  });

  it("after a confirmed Reset, Captivator opens on the Starter Splash Page when rendered again", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    seedSavedSplashPage(savedSplashPage);
    const { editor } = await renderCaptivator();

    await user.click(
      within(editor).getByRole("button", { name: "Reset to starter" }),
    );
    cleanup();
    const { preview } = await renderCaptivator();

    expect(within(preview).getByText("Free WiFi")).toBeInTheDocument();
    expect(
      within(preview).queryByRole("img", { name: "Logo" }),
    ).not.toBeInTheDocument();
  });

  it("the Device goes back to Mobile when Captivator is rendered again", async () => {
    const user = userEvent.setup();
    await renderCaptivator();
    await user.click(screen.getByRole("radio", { name: "Desktop" }));

    cleanup();
    const { preview } = await renderCaptivator();

    expect(screen.getByRole("radio", { name: "Mobile" })).toBeChecked();
    expect(
      within(preview).getByRole("figure", { name: "Mobile Preview" }),
    ).toBeInTheDocument();
  });
});
