import { cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  imageDataUrl,
  renderCaptivator,
  seedSavedSplashPage,
} from "@/app/test-helpers";
import type { SplashPage } from "@/splash-page";

/** A Splash Page far from the Starter Splash Page, images and all. */
const savedSplashPage: SplashPage = {
  logo: imageDataUrl("cafe-logo.png"),
  background: {
    kind: "image",
    colour: "#000000",
    imageUrl: imageDataUrl("venue.png"),
  },
  textBlocks: [
    {
      id: "saved-text-block",
      text: "Welcome to the Café",
      colour: "#ff0000",
      size: 48,
    },
  ],
  inputFields: [{ type: "Name" }, { type: "Phone" }],
  connectButton: { backgroundColour: "#00ff00", textColour: "#000000" },
};

describe("Captivator: remembering the Splash Page in this browser", () => {
  it("an edited Text Block is still shown in the Preview after Captivator is rendered again", async () => {
    const user = userEvent.setup();
    const { editor } = renderCaptivator();
    const textBlockText = within(editor).getByRole("textbox", {
      name: "Text Block 1 text",
    });
    await user.clear(textBlockText);
    await user.type(textBlockText, "Welcome to the Café");

    cleanup();
    const { preview } = renderCaptivator();

    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
    expect(within(preview).queryByText("Free WiFi")).not.toBeInTheDocument();
  });

  it("a saved Splash Page opens in the Preview, including its Logo and Background image", () => {
    seedSavedSplashPage(savedSplashPage);

    const { preview, background } = renderCaptivator();

    expect(within(preview).getByRole("img", { name: "Logo" })).toHaveAttribute(
      "src",
      imageDataUrl("cafe-logo.png"),
    );
    expect(background()).toHaveStyle({
      backgroundImage: `url("${imageDataUrl("venue.png")}")`,
    });
    expect(within(preview).getByText("Welcome to the Café")).toHaveStyle({
      color: "#ff0000",
      fontSize: "48px",
    });
    expect(
      within(preview).getByRole("textbox", { name: "Phone" }),
    ).toBeInTheDocument();
    expect(within(preview).queryByText("Free WiFi")).not.toBeInTheDocument();
  });
});
