import { cleanup, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { editTextBlock1, renderCaptivator } from "@/app/test-helpers";

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

  it("an edit to a new Splash Page is still there after opening the first Splash Page and then the new one again, and the Device stays the same", async () => {
    const user = userEvent.setup();
    const { editor, preview } = await renderCaptivator();
    await user.click(screen.getByRole("radio", { name: "Desktop" }));
    await user.click(
      within(library()).getByRole("button", { name: "New Splash Page" }),
    );
    await editTextBlock1(user, editor, "Welcome to the Café");

    await user.click(
      within(library()).getByRole("button", { name: "My Splash Page" }),
    );

    expect(openName()).toEqual(["My Splash Page"]);
    expect(within(preview).getByText("Free WiFi")).toBeInTheDocument();
    expect(
      within(preview).queryByText("Welcome to the Café"),
    ).not.toBeInTheDocument();
    expect(
      within(editor).getByRole("textbox", { name: "Text Block 1 text" }),
    ).toHaveValue("Free WiFi");
    expect(screen.getByRole("radio", { name: "Desktop" })).toBeChecked();

    await user.click(
      within(library()).getByRole("button", { name: "Untitled Splash Page" }),
    );

    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
    expect(within(preview).queryByText("Free WiFi")).not.toBeInTheDocument();
    expect(
      within(preview).getByRole("figure", { name: "Desktop Preview" }),
    ).toBeInTheDocument();
  });

  it("rendering Captivator again shows the same Library, with the last-opened Splash Page open", async () => {
    const user = userEvent.setup();
    const { editor } = await renderCaptivator();
    await user.click(
      within(library()).getByRole("button", { name: "New Splash Page" }),
    );
    await editTextBlock1(user, editor, "Welcome to the Café");
    await user.click(
      within(library()).getByRole("button", { name: "New Splash Page" }),
    );
    await user.click(
      within(library()).getAllByRole("button", {
        name: "Untitled Splash Page",
      })[0],
    );

    cleanup();
    const { preview } = await renderCaptivator();

    expect(libraryNames()).toEqual([
      "My Splash Page",
      "Untitled Splash Page",
      "Untitled Splash Page",
    ]);
    expect(
      within(library()).getAllByRole("button", {
        name: "Untitled Splash Page",
      })[0],
    ).toHaveAttribute("aria-current", "true");
    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
  });

  it("the Name field shows the open Splash Page's name, and renaming it there shows the new name in the Library", async () => {
    const user = userEvent.setup();
    const { editor } = await renderCaptivator();
    const name = within(editor).getByRole("textbox", { name: "Name" });
    expect(name).toHaveValue("My Splash Page");

    await user.clear(name);
    await user.type(name, "Corner Café");

    expect(libraryNames()).toEqual(["Corner Café"]);
    expect(openName()).toEqual(["Corner Café"]);
  });
});
