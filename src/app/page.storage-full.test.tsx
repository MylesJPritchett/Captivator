import { act, cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  editTextBlock1,
  failIndexedDbWrites,
  imageDataUrl,
  imageFile,
  pickColour,
  renderCaptivator,
  storageFull,
} from "@/app/test-helpers";
import { savesSettled } from "@/splash-page";

/** Saves longer than this fail, as if this browser's storage were full. */
const storageLimit = 2_000;

/** The bytes of a PNG too large to remember within the storage limit. */
const largeImageBytes = "x".repeat(storageLimit);

const largeImageDataUrl = imageDataUrl(largeImageBytes);

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
    failIndexedDbWrites((value) =>
      String(value).length > storageLimit ? storageFull() : undefined,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uploading a Background image too large to remember tells the Customer, and the Preview still shows it", async () => {
    const user = userEvent.setup();
    const { editor, background } = await renderCaptivator();

    await user.upload(
      within(editor).getByLabelText("Background image"),
      imageFile("venue.png", largeImageBytes),
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
    const { editor, preview } = await renderCaptivator();

    await user.upload(
      within(editor).getByLabelText("Logo image"),
      imageFile("cafe-logo.png", largeImageBytes),
    );

    await waitFor(() =>
      expect(savedNote(editor)).toHaveTextContent(imagesTooLarge),
    );
    expect(within(preview).getByRole("img", { name: "Logo" })).toHaveAttribute(
      "src",
      largeImageDataUrl,
    );

    cleanup();
    const rendered = await renderCaptivator();

    expect(
      within(rendered.preview).queryByRole("img", { name: "Logo" }),
    ).not.toBeInTheDocument();
  });

  it("telling the Customer their images are too large doesn't move focus", async () => {
    const user = userEvent.setup();
    const { editor } = await renderCaptivator();
    const backgroundImage = within(editor).getByLabelText("Background image");

    await user.upload(backgroundImage, imageFile("venue.png", largeImageBytes));

    await waitFor(() =>
      expect(savedNote(editor)).toHaveTextContent(imagesTooLarge),
    );
    expect(backgroundImage).toHaveFocus();
  });

  it("replacing a Background image too large to remember with one that fits clears the message", async () => {
    const user = userEvent.setup();
    const { editor } = await renderCaptivator();
    const backgroundImage = within(editor).getByLabelText("Background image");
    await user.upload(backgroundImage, imageFile("venue.png", largeImageBytes));
    await waitFor(() =>
      expect(savedNote(editor)).toHaveTextContent(imagesTooLarge),
    );

    await user.upload(backgroundImage, imageFile("small-venue.png"));

    await waitFor(() =>
      expect(savedNote(editor)).not.toHaveTextContent(imagesTooLarge),
    );
    expect(savedNote(editor)).toHaveTextContent(
      "Your Splash Pages are saved in this browser.",
    );
  });

  it("when the Open Splash Page's images are too large to remember, the other Splash Pages keep theirs after Captivator is rendered again", async () => {
    const user = userEvent.setup();
    const { editor } = await renderCaptivator();
    await user.upload(
      within(editor).getByLabelText("Logo image"),
      imageFile("cafe-logo.png"),
    );
    await user.click(screen.getByRole("button", { name: "New Splash Page" }));
    await user.upload(
      within(editor).getByLabelText("Background image"),
      imageFile("venue.png", largeImageBytes),
    );
    await waitFor(() =>
      expect(savedNote(editor)).toHaveTextContent(imagesTooLarge),
    );

    cleanup();
    const { preview, background } = await renderCaptivator();
    expect(background()).not.toHaveStyle({
      backgroundImage: `url("${largeImageDataUrl}")`,
    });
    await user.click(screen.getByRole("button", { name: "My Splash Page" }));

    expect(within(preview).getByRole("img", { name: "Logo" })).toHaveAttribute(
      "src",
      imageDataUrl("cafe-logo.png"),
    );
  });

  it("after images too large to remember, rendering Captivator again shows the text and colours without the images", async () => {
    const user = userEvent.setup();
    const { editor } = await renderCaptivator();
    await user.upload(
      within(editor).getByLabelText("Logo image"),
      imageFile("cafe-logo.png", largeImageBytes),
    );
    pickColour(within(editor).getByLabelText("Background colour"), "#123456");
    await user.upload(
      within(editor).getByLabelText("Background image"),
      imageFile("venue.png", largeImageBytes),
    );
    await editTextBlock1(user, editor, "Welcome to the Café");
    await waitFor(() =>
      expect(savedNote(editor)).toHaveTextContent(imagesTooLarge),
    );

    cleanup();
    const { preview, background } = await renderCaptivator();

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

  it("after one Splash Page's images are too large to remember, editing another Splash Page is still saved", async () => {
    const user = userEvent.setup();
    const { editor } = await renderCaptivator();
    await user.click(screen.getByRole("button", { name: "New Splash Page" }));
    await user.click(screen.getByRole("button", { name: "My Splash Page" }));
    await user.upload(
      within(editor).getByLabelText("Background image"),
      imageFile("venue.png", largeImageBytes),
    );
    await waitFor(() =>
      expect(savedNote(editor)).toHaveTextContent(imagesTooLarge),
    );

    await user.click(
      screen.getByRole("button", { name: "Untitled Splash Page" }),
    );
    await editTextBlock1(user, editor, "Welcome to the Café");
    await act(() => savesSettled());

    expect(savedNote(editor)).toHaveTextContent(imagesTooLarge);
    cleanup();
    const { preview } = await renderCaptivator();
    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
  });
});
