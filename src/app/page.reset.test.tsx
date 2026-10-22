import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderCaptivator } from "@/app/test-helpers";

/** Edits the Splash Page away from the Starter Splash Page. */
async function editSplashPage(
  user: ReturnType<typeof userEvent.setup>,
  editor: HTMLElement,
) {
  const textBlockText = within(editor).getByRole("textbox", {
    name: "Text Block 1 text",
  });
  await user.clear(textBlockText);
  await user.type(textBlockText, "Welcome to the Café");
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
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
    const { preview, editor } = renderCaptivator();
    await editSplashPage(user, editor);
    await user.click(screen.getByRole("radio", { name: "Desktop" }));

    within(editor).getByRole("button", { name: "Reset to starter" }).focus();
    await user.keyboard("{Enter}");

    expect(confirm).toHaveBeenCalledOnce();
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
});
