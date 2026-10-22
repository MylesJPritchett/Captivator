import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import Home from "@/app/page";

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

/**
 * jsdom has no object URLs, so give each uploaded file a predictable one
 * (`blob:<file name>`). Call at the top of a test file.
 */
export function stubObjectUrls() {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  beforeEach(() => {
    URL.createObjectURL = (file: Blob) => `blob:${(file as File).name}`;
    URL.revokeObjectURL = () => {};
  });
  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });
}

/** A small PNG file with the given name. */
export function imageFile(name: string) {
  return new File(["fake image"], name, { type: "image/png" });
}

/**
 * user-event can't drive a native colour input, so pick the colour the way
 * the browser reports it: a change event carrying the new hex value.
 */
export function pickColour(colourInput: HTMLElement, colour: string) {
  fireEvent.change(colourInput, { target: { value: colour } });
}
