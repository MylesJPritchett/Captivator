// PLACEHOLDER: throwaway test proving React Testing Library + jsdom work.
// Delete this file once the first real Editor + Preview test exists.
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("starter home page (placeholder)", () => {
  it("shows the getting-started heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: /to get started/i }),
    ).toBeInTheDocument();
  });
});
