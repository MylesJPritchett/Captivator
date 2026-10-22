import { fireEvent, render, screen, within } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";
import Home from "@/app/page";
import { savedSplashPageKey, type SplashPage } from "@/splash-page";

/** Renders Captivator and returns its Preview and Editor regions. */
export function renderCaptivator() {
  render(<Home />);
  const preview = screen.getByRole("region", { name: "Preview" });
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

/** The Appearance radio group, outside the Editor and the Preview. */
export function appearanceGroup() {
  return screen.getByRole("group", { name: "Appearance" });
}

/** The Appearance option with this name, e.g. "Dark". */
export function appearanceOption(name: "Light" | "System" | "Dark") {
  return within(appearanceGroup()).getByRole("radio", { name });
}

/** Chooses an Appearance by clicking its option. */
export async function chooseAppearance(
  user: UserEvent,
  name: "Light" | "System" | "Dark",
) {
  await user.click(appearanceOption(name));
}

/**
 * user-event can't drive a native colour input, so pick the colour the way
 * the browser reports it: a change event carrying the new hex value.
 */
export function pickColour(colourInput: HTMLElement, colour: string) {
  fireEvent.change(colourInput, { target: { value: colour } });
}

/** The localStorage key Captivator remembers the Splash Page under. */
export { savedSplashPageKey };

/** Seeds a remembered Splash Page, as if saved on an earlier visit. */
export function seedSavedSplashPage(splashPage: SplashPage) {
  localStorage.setItem(savedSplashPageKey, JSON.stringify(splashPage));
}
