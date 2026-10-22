import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderCaptivator } from "@/app/test-helpers";

function appearance() {
  return screen.getByRole("group", { name: "Appearance" });
}

describe("Captivator: Appearance", () => {
  it("offers Light, System and Dark Appearance, with System chosen by default", () => {
    renderCaptivator();

    const [light, system, dark, ...others] =
      within(appearance()).getAllByRole("radio");
    expect(light).toHaveAccessibleName("Light");
    expect(system).toHaveAccessibleName("System");
    expect(dark).toHaveAccessibleName("Dark");
    expect(others).toEqual([]);
    expect(
      within(appearance()).getByRole("radio", { name: "System" }),
    ).toBeChecked();
  });

  it("the Customer can choose Dark Appearance by keyboard", async () => {
    const user = userEvent.setup();
    renderCaptivator();

    within(appearance()).getByRole("radio", { name: "System" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(
      within(appearance()).getByRole("radio", { name: "Dark" }),
    ).toBeChecked();
    expect(
      within(appearance()).getByRole("radio", { name: "System" }),
    ).not.toBeChecked();
  });
});
