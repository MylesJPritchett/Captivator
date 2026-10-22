import { waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderCaptivator } from "@/app/test-helpers";

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
});
