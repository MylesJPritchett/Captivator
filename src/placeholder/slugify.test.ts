// PLACEHOLDER: throwaway test proving the Vitest unit layer works.
// Delete the src/placeholder/ folder once the first real Splash Page reducer test exists.
import { describe, expect, it } from "vitest";
import { slugify } from "@/placeholder/slugify";

describe("slugify (placeholder)", () => {
  it("lower-cases words and joins them with hyphens", () => {
    expect(slugify("  Joe's Coffee  Shop ")).toBe("joes-coffee-shop");
  });
});
