import { cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderCaptivator } from "@/app/test-helpers";

describe("Captivator: remembering the Splash Page in this browser", () => {
  it("an edited Text Block is still shown in the Preview after Captivator is rendered again", async () => {
    const user = userEvent.setup();
    const { editor } = renderCaptivator();
    const textBlockText = within(editor).getByRole("textbox", {
      name: "Text Block 1 text",
    });
    await user.clear(textBlockText);
    await user.type(textBlockText, "Welcome to the Café");

    cleanup();
    const { preview } = renderCaptivator();

    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
    expect(within(preview).queryByText("Free WiFi")).not.toBeInTheDocument();
  });
});
