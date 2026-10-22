import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderCaptivator } from "@/app/test-helpers";

/** The Library, down the left side of the screen. */
function library() {
  return screen.getByRole("navigation", { name: "Library" });
}

/** The names on the Library's Splash Page buttons, in order. */
function libraryNames() {
  return within(library())
    .getAllByRole("button")
    .map((button) => button.textContent)
    .filter((name) => name !== "New Splash Page");
}

/** The name of the Splash Page the Library marks as open. */
function openName() {
  const open = within(library())
    .getAllByRole("button")
    .filter((button) => button.getAttribute("aria-current") === "true");
  return open.map((button) => button.textContent);
}

describe("Captivator: the Library", () => {
  it("New Splash Page adds an Untitled Splash Page at the bottom of the Library and opens it", async () => {
    const user = userEvent.setup();
    await renderCaptivator();

    await user.click(
      within(library()).getByRole("button", { name: "New Splash Page" }),
    );

    expect(libraryNames()).toEqual(["My Splash Page", "Untitled Splash Page"]);
    expect(openName()).toEqual(["Untitled Splash Page"]);
  });
});
