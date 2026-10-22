import { cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  appearanceGroup,
  appearanceOption,
  chooseAppearance,
  renderCaptivator,
} from "@/app/test-helpers";
import { savedAppearanceKey } from "@/appearance";

describe("Captivator: Appearance", () => {
  it("offers Light, System and Dark Appearance, with System chosen by default", async () => {
    await renderCaptivator();

    const [light, system, dark, ...others] =
      within(appearanceGroup()).getAllByRole("radio");
    expect(light).toHaveAccessibleName("Light");
    expect(system).toHaveAccessibleName("System");
    expect(dark).toHaveAccessibleName("Dark");
    expect(others).toEqual([]);
    expect(appearanceOption("System")).toBeChecked();
  });

  it("the Customer can choose Dark Appearance by keyboard", async () => {
    const user = userEvent.setup();
    await renderCaptivator();

    appearanceOption("System").focus();
    await user.keyboard("{ArrowRight}");

    expect(appearanceOption("Dark")).toBeChecked();
    expect(appearanceOption("System")).not.toBeChecked();
  });

  it("a chosen Dark Appearance is still chosen after Captivator is rendered again", async () => {
    const user = userEvent.setup();
    await renderCaptivator();
    await chooseAppearance(user, "Dark");

    cleanup();
    await renderCaptivator();

    expect(appearanceOption("Dark")).toBeChecked();
  });

  it.each([
    ["isn't an Appearance", "purple"],
    ["is empty", ""],
  ])(
    "a remembered Appearance that %s opens on System Appearance",
    async (_, saved) => {
      localStorage.setItem(savedAppearanceKey, saved);

      await renderCaptivator();

      expect(appearanceOption("System")).toBeChecked();
    },
  );
});
