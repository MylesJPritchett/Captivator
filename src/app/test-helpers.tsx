import { fireEvent, render, screen, within } from "@testing-library/react";
import Home from "@/app/page";
import type { SplashPage } from "@/splash-page";

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

/** A small PNG file with the given name. Its bytes are its name. */
export function imageFile(name: string) {
  return new File([name], name, { type: "image/png" });
}

/**
 * The data URL the Preview shows once `imageFile(name)` is uploaded, e.g.
 * "data:image/png;base64,dmVudWUucG5n" for "venue.png".
 */
export function imageDataUrl(name: string) {
  return `data:image/png;base64,${btoa(name)}`;
}

/**
 * user-event can't drive a native colour input, so pick the colour the way
 * the browser reports it: a change event carrying the new hex value.
 */
export function pickColour(colourInput: HTMLElement, colour: string) {
  fireEvent.change(colourInput, { target: { value: colour } });
}

/** The localStorage key Captivator remembers the Splash Page under. */
export const savedSplashPageKey = "captivator.splashPage.v1";

/** Seeds a remembered Splash Page, as if saved on an earlier visit. */
export function seedSavedSplashPage(splashPage: SplashPage) {
  localStorage.setItem(savedSplashPageKey, JSON.stringify(splashPage));
}
