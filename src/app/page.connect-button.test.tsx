import { within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { pickColour, renderCaptivator } from "@/app/test-helpers";

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
