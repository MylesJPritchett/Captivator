import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

function renderCaptivator() {
  render(<Home />);
  return {
    preview: screen.getByRole("region", { name: "Preview" }),
    editor: screen.getByRole("region", { name: "Editor" }),
  };
}

describe("Captivator: Editor and Preview", () => {
  it("the Preview shows the starter Splash Page", () => {
    const { preview } = renderCaptivator();

    expect(within(preview).getByText("Free WiFi")).toBeInTheDocument();
    expect(
      within(preview).getByRole("textbox", { name: "Email" }),
    ).toBeInTheDocument();
    expect(
      within(preview).getByRole("button", { name: "Connect" }),
    ).toBeInTheDocument();
  });

  it("editing a Text Block's text in the Editor updates the Preview", async () => {
    const user = userEvent.setup();
    const { preview, editor } = renderCaptivator();

    const textBlockText = within(editor).getByRole("textbox", {
      name: "Text Block 1 text",
    });
    await user.clear(textBlockText);
    await user.type(textBlockText, "Welcome to the Café");

    expect(within(preview).getByText("Welcome to the Café")).toBeInTheDocument();
    expect(within(preview).queryByText("Free WiFi")).not.toBeInTheDocument();
  });
});
