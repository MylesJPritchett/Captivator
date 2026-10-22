import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { editTextBlock1, renderCaptivator } from "@/app/test-helpers";

/** Edits the Splash Page away from the Starter Splash Page. */
async function editSplashPage(
  user: ReturnType<typeof userEvent.setup>,
  editor: HTMLElement,
) {
  await editTextBlock1(user, editor, "Welcome to the Café");
  await user.click(
    within(editor).getByRole("button", { name: "Add Input Field" }),
  );
}

function previewInputFieldNames(preview: HTMLElement) {
  return within(preview)
    .queryAllByRole("textbox")
    .map((field) => field.getAttribute("placeholder"));
}

describe("Captivator: Reset to starter", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("confirming Reset by keyboard returns the Preview to the Starter Splash Page and keeps the Device", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const { preview, editor } = await renderCaptivator();
    await editSplashPage(user, editor);
    await user.click(screen.getByRole("radio", { name: "Desktop" }));

    within(editor).getByRole("button", { name: "Reset to starter" }).focus();
    await user.keyboard("{Enter}");

    expect(within(preview).getByText("Free WiFi")).toBeInTheDocument();
    expect(
      within(preview).queryByText("Welcome to the Café"),
    ).not.toBeInTheDocument();
    expect(previewInputFieldNames(preview)).toEqual(["Email"]);
    expect(screen.getByRole("radio", { name: "Desktop" })).toBeChecked();
    expect(
      within(preview).getByRole("figure", { name: "Desktop Preview" }),
    ).toBeInTheDocument();
  });

  it("cancelling the Reset confirmation leaves the Splash Page unchanged", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const { preview, editor } = await renderCaptivator();
    await editSplashPage(user, editor);

    await user.click(
      within(editor).getByRole("button", { name: "Reset to starter" }),
    );

    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
    expect(within(preview).queryByText("Free WiFi")).not.toBeInTheDocument();
    expect(previewInputFieldNames(preview)).toEqual(["Email", "Name"]);
  });

  it("Reset returns only the Open Splash Page to the Starter Splash Page", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const { preview, editor } = await renderCaptivator();
    const library = screen.getByRole("navigation", { name: "Library" });
    await editTextBlock1(user, editor, "Welcome to the Café");
    await user.click(
      within(library).getByRole("button", { name: "New Splash Page" }),
    );
    await editTextBlock1(user, editor, "Happy hour");

    await user.click(
      within(editor).getByRole("button", { name: "Reset to starter" }),
    );
    expect(within(preview).getByText("Free WiFi")).toBeInTheDocument();
    await user.click(
      within(library).getByRole("button", { name: "My Splash Page" }),
    );

    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
  });
});
