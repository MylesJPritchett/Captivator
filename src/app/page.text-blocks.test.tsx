import { within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderCaptivator } from "@/app/test-helpers";

describe("Captivator: clicking a Text Block in the Preview", () => {
  it("focuses that Text Block's text input in the Editor", async () => {
    const user = userEvent.setup();
    const { preview, editor } = await renderCaptivator();

    await user.click(within(preview).getByText("Free WiFi"));

    expect(
      within(editor).getByRole("textbox", { name: "Text Block 1 text" }),
    ).toHaveFocus();
  });

  it("with two Text Blocks, clicking the second focuses the second Text Block's text input", async () => {
    const user = userEvent.setup();
    const { preview, editor } = await renderCaptivator();
    await user.click(
      within(editor).getByRole("button", { name: "Add Text Block" }),
    );
    const secondTextInput = within(editor).getByRole("textbox", {
      name: "Text Block 2 text",
    });
    await user.clear(secondTextInput);
    await user.type(secondTextInput, "Welcome in");
    // Move focus away so the click below has to bring it back.
    within(editor).getByRole("textbox", { name: "Text Block 1 text" }).focus();

    await user.click(within(preview).getByText("Welcome in"));

    expect(
      within(editor).getByRole("textbox", { name: "Text Block 2 text" }),
    ).toHaveFocus();
  });
});
