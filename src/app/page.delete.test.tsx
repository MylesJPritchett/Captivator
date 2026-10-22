import { cleanup, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  renderCaptivator,
  savedLibrary,
  seedSavedLibrary,
} from "@/app/test-helpers";
import { starterSplashPage, type SplashPage } from "@/splash-page";

const cafe: SplashPage = {
  ...starterSplashPage,
  textBlocks: [
    { id: "cafe", text: "Welcome to the Café", colour: "#111827", size: 24 },
  ],
};

const bar: SplashPage = {
  ...starterSplashPage,
  textBlocks: [{ id: "bar", text: "Happy hour", colour: "#ef4444", size: 30 }],
};

/** Seeds a saved Library of the Café and Bar Splash Pages, with the Bar open. */
async function seedCafeAndBar() {
  await seedSavedLibrary(
    savedLibrary(cafe, {
      splashPages: [
        { id: "cafe", name: "Café", splashPage: cafe },
        { id: "bar", name: "Bar", splashPage: bar },
      ],
      openSplashPageId: "bar",
    }),
  );
}

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

/** The names of the Splash Pages the Library marks as open. */
function openName() {
  return within(library())
    .getAllByRole("button")
    .filter((button) => button.getAttribute("aria-current") === "true")
    .map((button) => button.textContent);
}

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
