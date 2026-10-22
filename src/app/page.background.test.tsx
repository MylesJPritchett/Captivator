import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

function renderCaptivator() {
  render(<Home />);
  const preview = screen.getByRole("region", { name: "Preview" });
  return {
    preview,
    editor: screen.getByRole("region", { name: "Editor" }),
    background: () => within(preview).getByRole("img", { name: "Background" }),
  };
}

// user-event can't drive a native colour input, so pick the colour the way
// the browser reports it: a change event carrying the new hex value.
function pickColour(colourInput: HTMLElement, colour: string) {
  fireEvent.change(colourInput, { target: { value: colour } });
}

describe("Captivator: Background", () => {
  it("changing the Background colour in the Editor updates the Preview", () => {
    const { editor, background } = renderCaptivator();

    pickColour(within(editor).getByLabelText("Background colour"), "#10b981");

    expect(background()).toHaveStyle({ backgroundColor: "#10b981" });
  });
});
