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
});

describe("Captivator: Device toggle", () => {
  it("the Preview opens on Mobile", () => {
    const { preview } = renderCaptivator();

    expect(screen.getByRole("radio", { name: "Mobile" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Desktop" })).not.toBeChecked();
    expect(
      within(preview).getByRole("figure", { name: "Mobile Preview" }),
    ).toBeInTheDocument();
  });

  it("choosing Desktop shows the Desktop frame, and choosing Mobile switches back", async () => {
    const user = userEvent.setup();
    const { preview } = renderCaptivator();

    await user.click(screen.getByRole("radio", { name: "Desktop" }));

    expect(screen.getByRole("radio", { name: "Desktop" })).toBeChecked();
    expect(
      within(preview).getByRole("figure", { name: "Desktop Preview" }),
    ).toBeInTheDocument();
    expect(
      within(preview).queryByRole("figure", { name: "Mobile Preview" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Mobile" }));

    expect(
      within(preview).getByRole("figure", { name: "Mobile Preview" }),
    ).toBeInTheDocument();
    expect(
      within(preview).queryByRole("figure", { name: "Desktop Preview" }),
    ).not.toBeInTheDocument();
  });

  it("switching Device leaves the Splash Page unchanged", async () => {
    const user = userEvent.setup();
    const { preview, editor } = renderCaptivator();

    const textBlockText = within(editor).getByRole("textbox", {
      name: "Text Block 1 text",
    });
    await user.clear(textBlockText);
    await user.type(textBlockText, "Welcome to the Café");

    await user.click(screen.getByRole("radio", { name: "Desktop" }));
    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Mobile" }));
    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
    expect(textBlockText).toHaveValue("Welcome to the Café");
  });
});
