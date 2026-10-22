import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { imageFile, pickColour, renderCaptivator } from "@/app/test-helpers";

describe("Captivator: Editor and Preview", () => {
  it("the Preview shows the starter Splash Page", async () => {
    const { preview } = await renderCaptivator();

    expect(within(preview).getByText("Free WiFi")).toBeInTheDocument();
    expect(
      within(preview).getByRole("textbox", { name: "Email" }),
    ).toBeInTheDocument();
    expect(
      within(preview).getByRole("button", { name: "Connect" }),
    ).toBeInTheDocument();
  });

  it("the Preview's Input Fields and Connect Button are inert, but not shown as disabled", async () => {
    const user = userEvent.setup();
    const { preview } = await renderCaptivator();
    const email = within(preview).getByRole("textbox", { name: "Email" });
    const connectButton = within(preview).getByRole("button", {
      name: "Connect",
    });

    await user.type(email, "guest@example.com");

    expect(email).toHaveValue("");
    // A Guest sees them enabled, so the Preview mustn't grey them out.
    expect(email).toBeEnabled();
    expect(connectButton).toBeEnabled();
  });

  describe("with a Logo, Text Blocks, Input Fields and the Connect Button all shown", () => {
    it("the Preview's elements are pointer-only: Tab goes from the Device toggle straight to the first Editor control", async () => {
      const user = userEvent.setup();
      const { preview, editor } = await renderCaptivator();
      await user.upload(
        within(editor).getByLabelText("Logo image"),
        imageFile("cafe-logo.png"),
      );
      expect(
        await within(preview).findByRole("img", { name: "Logo" }),
      ).toBeVisible();
      expect(within(preview).getByText("Free WiFi")).toBeVisible();
      expect(
        within(preview).getByRole("textbox", { name: "Email" }),
      ).toBeVisible();
      expect(
        within(preview).getByRole("button", { name: "Connect" }),
      ).toBeVisible();

      screen.getByRole("radio", { name: "Mobile" }).focus();
      await user.tab();

      expect(within(editor).getByLabelText("Logo image")).toHaveFocus();
    });
  });

  it("tells the Customer the design is saved in this browser", async () => {
    const { editor } = await renderCaptivator();

    expect(
      within(editor).getByText("Your design is saved in this browser."),
    ).toBeVisible();
  });

  it("editing a Text Block's text in the Editor updates the Preview", async () => {
    const user = userEvent.setup();
    const { preview, editor } = await renderCaptivator();

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
    const { preview, editor } = await renderCaptivator();

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

  it("changing a Text Block's colour in the Editor recolours it in the Preview", async () => {
    const { preview, editor } = await renderCaptivator();

    pickColour(within(editor).getByLabelText("Text Block 1 colour"), "#ff0000");

    expect(within(preview).getByText("Free WiFi")).toHaveStyle({
      color: "#ff0000",
    });
  });

  it("changing a Text Block's size with its slider resizes it in the Preview and shows the size", async () => {
    const { preview, editor } = await renderCaptivator();

    const size = within(editor).getByRole("slider", {
      name: "Text Block 1 size",
    });
    expect(size).toHaveAttribute("min", "12");
    expect(size).toHaveAttribute("max", "64");

    // user-event can't drag a range slider, so set its value directly.
    fireEvent.change(size, { target: { value: "48" } });

    expect(within(preview).getByText("Free WiFi")).toHaveStyle({
      fontSize: "48px",
    });
    expect(within(editor).getByText("48px")).toBeInTheDocument();
  });

  it("a Text Block with empty text is left out of the Preview", async () => {
    const user = userEvent.setup();
    const { preview, editor } = await renderCaptivator();
    expect(within(preview).getAllByRole("paragraph")).toHaveLength(1);

    await user.clear(
      within(editor).getByRole("textbox", { name: "Text Block 1 text" }),
    );

    expect(within(preview).queryAllByRole("paragraph")).toHaveLength(0);
  });

  it("removing the only Text Block removes it from the Preview", async () => {
    const user = userEvent.setup();
    const { preview, editor } = await renderCaptivator();

    await user.click(
      within(editor).getByRole("button", { name: "Remove Text Block 1" }),
    );

    expect(within(preview).queryByText("Free WiFi")).not.toBeInTheDocument();
    expect(
      within(editor).queryByRole("textbox", { name: "Text Block 1 text" }),
    ).not.toBeInTheDocument();
  });
});

describe("Captivator: Device toggle", () => {
  it("the Preview opens on Mobile", async () => {
    const { preview } = await renderCaptivator();

    expect(screen.getByRole("radio", { name: "Mobile" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Desktop" })).not.toBeChecked();
    expect(
      within(preview).getByRole("figure", { name: "Mobile Preview" }),
    ).toBeInTheDocument();
  });

  it("choosing Desktop shows the Desktop frame, and choosing Mobile switches back", async () => {
    const user = userEvent.setup();
    const { preview } = await renderCaptivator();

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
    const { preview, editor } = await renderCaptivator();

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
