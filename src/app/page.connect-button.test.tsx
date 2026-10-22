import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

function renderCaptivator() {
  render(<Home />);
  return {
    preview: screen.getByRole("region", { name: "Preview" }),
    editor: screen.getByRole("region", { name: "Editor" }),
  };
}

// user-event can't drive a native colour input, so pick the colour the way
// the browser reports it: a change event carrying the new hex value.
function pickColour(colourInput: HTMLElement, colour: string) {
  fireEvent.change(colourInput, { target: { value: colour } });
}

describe("Captivator: Connect Button", () => {
  it("changing the Connect Button background colour in the Editor updates the Preview", () => {
    const { preview, editor } = renderCaptivator();

    pickColour(
      within(editor).getByLabelText("Connect Button background colour"),
      "#10b981",
    );

    expect(
      within(preview).getByRole("button", { name: "Connect" }),
    ).toHaveStyle({ backgroundColor: "#10b981" });
  });

  it("changing the Connect Button text colour in the Editor updates the Preview, and the label stays Connect", () => {
    const { preview, editor } = renderCaptivator();

    pickColour(
      within(editor).getByLabelText("Connect Button text colour"),
      "#111827",
    );

    const connectButton = within(preview).getByRole("button", {
      name: "Connect",
    });
    expect(connectButton).toHaveStyle({ color: "#111827" });
    expect(connectButton).toHaveTextContent(/^Connect$/);
  });
});
