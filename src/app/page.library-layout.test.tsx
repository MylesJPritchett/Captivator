import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderCaptivator } from "@/app/test-helpers";

/** The "Library" button narrow screens show above the Preview. */
function libraryButton() {
  return screen.getByRole("button", { name: "Library" });
}

describe("Captivator: the Library on narrow screens", () => {
  it("the Library button shows and hides the Library, from the mouse or the keyboard", async () => {
    const user = userEvent.setup();
    await renderCaptivator();
    const library = screen.getByRole("navigation", { name: "Library" });

    expect(libraryButton()).toHaveAttribute("aria-expanded", "false");
    const controlled = document.getElementById(
      libraryButton().getAttribute("aria-controls") ?? "",
    );
    expect(controlled).toContainElement(library);

    await user.click(libraryButton());
    expect(libraryButton()).toHaveAttribute("aria-expanded", "true");

    libraryButton().focus();
    await user.keyboard("{Enter}");
    expect(libraryButton()).toHaveAttribute("aria-expanded", "false");

    await user.keyboard(" ");
    expect(libraryButton()).toHaveAttribute("aria-expanded", "true");
  });
});
