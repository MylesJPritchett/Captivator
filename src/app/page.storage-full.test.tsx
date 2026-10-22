import { cleanup, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { imageFile, pickColour, renderCaptivator } from "@/app/test-helpers";

/** Saves longer than this fail, as if this browser's storage were full. */
const storageLimit = 2_000;

/** A PNG file too large to remember within the storage limit. */
function largeImageFile(name: string) {
  return new File(["x".repeat(storageLimit)], name, { type: "image/png" });
}

const largeImageDataUrl = `data:image/png;base64,${btoa("x".repeat(storageLimit))}`;

const imagesTooLarge =
  "Your images are too large to remember in this browser; text and colours are still saved.";

/** The Editor's note on saving, a polite live region. */
function savedNote(editor: HTMLElement) {
  const note = within(editor)
    .getAllByRole("status")
    .find((status) => status.textContent?.includes("saved in this browser"));
  if (!note) throw new Error("No saved note in the Editor");
  return note;
}

describe("Captivator: images too large to remember", () => {
  beforeEach(() => {
    const setItem = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key: string,
      value: string,
    ) {
      if (value.length > storageLimit) {
        throw new DOMException(
          "The quota has been exceeded.",
          "QuotaExceededError",
        );
      }
      setItem.call(this, key, value);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uploading a Background image too large to remember tells the Customer, and the Preview still shows it", async () => {
    const user = userEvent.setup();
    const { editor, background } = renderCaptivator();

    await user.upload(
      within(editor).getByLabelText("Background image"),
      largeImageFile("venue.png"),
    );

    await waitFor(() =>
      expect(savedNote(editor)).toHaveTextContent(imagesTooLarge),
    );
    expect(background()).toHaveStyle({
      backgroundImage: `url("${largeImageDataUrl}")`,
    });
  });

  it("a Logo too large to remember still shows in the Preview, and is gone after Captivator is rendered again", async () => {
    const user = userEvent.setup();
    const { editor, preview } = renderCaptivator();

    await user.upload(
      within(editor).getByLabelText("Logo image"),
      largeImageFile("cafe-logo.png"),
    );

    await waitFor(() =>
      expect(savedNote(editor)).toHaveTextContent(imagesTooLarge),
    );
    expect(within(preview).getByRole("img", { name: "Logo" })).toHaveAttribute(
      "src",
      largeImageDataUrl,
    );

    cleanup();
    const rendered = renderCaptivator();

    expect(
      within(rendered.preview).queryByRole("img", { name: "Logo" }),
    ).not.toBeInTheDocument();
  });

  it("telling the Customer their images are too large doesn't move focus", async () => {
    const user = userEvent.setup();
    const { editor } = renderCaptivator();
    const backgroundImage = within(editor).getByLabelText("Background image");

    await user.upload(backgroundImage, largeImageFile("venue.png"));

    await waitFor(() =>
      expect(savedNote(editor)).toHaveTextContent(imagesTooLarge),
    );
    expect(backgroundImage).toHaveFocus();
  });

  it("replacing a Background image too large to remember with one that fits clears the message", async () => {
    const user = userEvent.setup();
    const { editor } = renderCaptivator();
    const backgroundImage = within(editor).getByLabelText("Background image");
    await user.upload(backgroundImage, largeImageFile("venue.png"));
    await waitFor(() =>
      expect(savedNote(editor)).toHaveTextContent(imagesTooLarge),
    );

    await user.upload(backgroundImage, imageFile("small-venue.png"));

    await waitFor(() =>
      expect(savedNote(editor)).not.toHaveTextContent(imagesTooLarge),
    );
    expect(savedNote(editor)).toHaveTextContent(
      "Your design is saved in this browser.",
    );
  });

  it("after images too large to remember, rendering Captivator again shows the text and colours without the images", async () => {
    const user = userEvent.setup();
    const { editor } = renderCaptivator();
    await user.upload(
      within(editor).getByLabelText("Logo image"),
      largeImageFile("cafe-logo.png"),
    );
    pickColour(within(editor).getByLabelText("Background colour"), "#123456");
    await user.upload(
      within(editor).getByLabelText("Background image"),
      largeImageFile("venue.png"),
    );
    const textBlockText = within(editor).getByRole("textbox", {
      name: "Text Block 1 text",
    });
    await user.clear(textBlockText);
    await user.type(textBlockText, "Welcome to the Café");
    await waitFor(() =>
      expect(savedNote(editor)).toHaveTextContent(imagesTooLarge),
    );

    cleanup();
    const { preview, background } = renderCaptivator();

    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
    expect(
      within(preview).queryByRole("img", { name: "Logo" }),
    ).not.toBeInTheDocument();
    expect(background()).toHaveStyle({ backgroundColor: "#123456" });
    expect(background()).not.toHaveStyle({
      backgroundImage: `url("${largeImageDataUrl}")`,
    });
  });
});
