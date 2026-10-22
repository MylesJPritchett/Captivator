import { cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  libraryNames,
  openName,
  renderCaptivator,
  seedCafeAndBar,
} from "@/app/test-helpers";

describe("Captivator: Delete", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("confirming Delete removes the Open Splash Page from the Library and opens the one above it, and rendering again agrees", async () => {
    const user = userEvent.setup();
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
    await seedCafeAndBar();
    const { editor, preview } = await renderCaptivator();

    await user.click(within(editor).getByRole("button", { name: "Delete" }));

    expect(confirm).toHaveBeenCalledWith(`Delete "Bar"? This can't be undone.`);
    expect(libraryNames()).toEqual(["Café"]);
    expect(openName()).toEqual(["Café"]);
    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
    expect(within(preview).queryByText("Happy hour")).not.toBeInTheDocument();

    cleanup();
    const rendered = await renderCaptivator();

    expect(libraryNames()).toEqual(["Café"]);
    expect(openName()).toEqual(["Café"]);
    expect(
      within(rendered.preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
  });

  it("cancelling the Delete confirmation leaves the Library and the Open Splash Page unchanged", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    await seedCafeAndBar();
    const { editor, preview } = await renderCaptivator();

    await user.click(within(editor).getByRole("button", { name: "Delete" }));

    expect(libraryNames()).toEqual(["Café", "Bar"]);
    expect(openName()).toEqual(["Bar"]);
    expect(within(preview).getByText("Happy hour")).toBeInTheDocument();
  });
});
