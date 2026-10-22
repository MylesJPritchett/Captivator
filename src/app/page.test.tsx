import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

function renderCaptivator() {
  render(<Home />);
  return {
    preview: screen.getByRole("region", { name: "Preview" }),
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
});
