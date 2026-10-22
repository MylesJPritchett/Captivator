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

  it("the Preview's Input Fields and Connect Button are inert", async () => {
    const user = userEvent.setup();
    const { preview } = renderCaptivator();

    const email = within(preview).getByRole("textbox", { name: "Email" });
    await user.type(email, "guest@example.com");

    expect(email).toHaveValue("");
    expect(
      within(preview).getByRole("button", { name: "Connect" }),
    ).toBeDisabled();
  });

  it("tells the Customer the design isn't saved on refresh", () => {
    renderCaptivator();

    expect(screen.getByText(/not saved/i)).toBeVisible();
  });

  it("editing a Text Block's text in the Editor updates the Preview", async () => {
    const user = userEvent.setup();
    const { preview, editor } = renderCaptivator();

    const textBlockText = within(editor).getByRole("textbox", {
      name: "Text Block 1 text",
    });
    await user.clear(textBlockText);
    await user.type(textBlockText, "Welcome to the Café");

    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
    expect(within(preview).queryByText("Free WiFi")).not.toBeInTheDocument();
  });

  it("adding a Text Block in the Editor shows it in the Preview after the existing ones", async () => {
    const user = userEvent.setup();
    const { preview, editor } = renderCaptivator();

    await user.click(
      within(editor).getByRole("button", { name: "Add Text Block" }),
    );
    const secondText = within(editor).getByRole("textbox", {
      name: "Text Block 2 text",
    });
    expect(secondText).not.toHaveValue("");
    expect(
      within(preview).getByText((secondText as HTMLInputElement).value),
    ).toBeInTheDocument();

    await user.clear(secondText);
    await user.type(secondText, "Sign in below");

    const freeWifi = within(preview).getByText("Free WiFi");
    const signIn = within(preview).getByText("Sign in below");
    expect(
      freeWifi.compareDocumentPosition(signIn) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("removing the only Text Block removes it from the Preview", async () => {
    const user = userEvent.setup();
    const { preview, editor } = renderCaptivator();

    await user.click(
      within(editor).getByRole("button", { name: "Remove Text Block 1" }),
    );

    expect(within(preview).queryByText("Free WiFi")).not.toBeInTheDocument();
    expect(
      within(editor).queryByRole("textbox", { name: "Text Block 1 text" }),
    ).not.toBeInTheDocument();
  });
});
