import { fireEvent, render, screen, within } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";
import Home from "@/app/page";
import { set } from "idb-keyval";
import { vi } from "vitest";
import {
  savedLibraryKey,
  savedSplashPageKey,
  type SplashPage,
} from "@/splash-page";

/** Renders Captivator and returns its Preview and Editor regions. */
export async function renderCaptivator() {
  render(<Home />);
  // The Editor and Preview wait for the saved Splash Page to load.
  const preview = await screen.findByRole("region", { name: "Preview" });
  return {
    preview,
    editor: screen.getByRole("region", { name: "Editor" }),
    background: () =>
      within(preview).getByRole("group", { name: "Background" }),
  };
}

/** A PNG file with the given name. Its bytes are its name unless given. */
export function imageFile(name: string, bytes = name) {
  return new File([bytes], name, { type: "image/png" });
}

/**
 * The data URL the Preview shows once a PNG with these bytes is uploaded, e.g.
 * "data:image/png;base64,dmVudWUucG5n" for `imageFile("venue.png")`.
 */
export function imageDataUrl(bytes: string) {
  return `data:image/png;base64,${btoa(bytes)}`;
}

/** Replaces Text Block 1's text in the Editor. */
export async function editTextBlock1(
  user: UserEvent,
  editor: HTMLElement,
  text: string,
) {
  const textBlockText = within(editor).getByRole("textbox", {
    name: "Text Block 1 text",
  });
  await user.clear(textBlockText);
  await user.type(textBlockText, text);
}

/**
 * user-event can't drive a native colour input, so pick the colour the way
 * the browser reports it: a change event carrying the new hex value.
 */
export function pickColour(colourInput: HTMLElement, colour: string) {
  fireEvent.change(colourInput, { target: { value: colour } });
}

/** The IndexedDB key Captivator remembers the Library under. */
export { savedLibraryKey };

/** The localStorage key ADR-0003 remembered the Splash Page under. */
export { savedSplashPageKey };

/**
 * Makes IndexedDB writes fail with the error `failure` returns for the value
 * being written, as a full or blocked store would; writes it returns nothing
 * for go through. Undo with `vi.restoreAllMocks()`.
 */
export function failIndexedDbWrites(
  failure: (value: unknown) => DOMException | undefined,
) {
  const put = IDBObjectStore.prototype.put;
  vi.spyOn(IDBObjectStore.prototype, "put").mockImplementation(function (
    this: IDBObjectStore,
    value: unknown,
    key?: IDBValidKey,
  ) {
    const error = failure(value);
    if (error) throw error;
    return put.call(this, value, key);
  });
}

/** Makes IndexedDB reads fail as a blocked store would. */
export function blockIndexedDbReads() {
  vi.spyOn(IDBObjectStore.prototype, "get").mockImplementation(() => {
    throw storageBlocked();
  });
}

/** What a browser throws when its site storage is blocked. */
export function storageBlocked() {
  return new DOMException("The operation is insecure.", "SecurityError");
}

/** What a browser throws when its site storage is full. */
export function storageFull() {
  return new DOMException("The quota has been exceeded.", "QuotaExceededError");
}

/** Seeds a saved Library value as is, as if saved on an earlier visit. */
export async function seedSavedLibrary(saved: string) {
  await set(savedLibraryKey, saved);
}

/**
 * Seeds a saved Library holding one open Splash Page, as if saved on an
 * earlier visit.
 */
export async function seedSavedSplashPage(splashPage: SplashPage) {
  await seedSavedLibrary(
    JSON.stringify({
      splashPages: [{ id: "saved", name: "My Splash Page", splashPage }],
      openSplashPageId: "saved",
    }),
  );
}
