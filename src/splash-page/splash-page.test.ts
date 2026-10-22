import { describe, expect, it } from "vitest";
import { splashPageReducer, starterSplashPage } from "@/splash-page";

const hexColour = /^#[0-9a-f]{6}$/i;

describe("starter Splash Page", () => {
  it("has one Free WiFi Text Block, one Email Input Field, a Background colour, Connect Button colours and no Logo", () => {
    expect(starterSplashPage.textBlocks).toHaveLength(1);
    expect(starterSplashPage.textBlocks[0].text).toBe("Free WiFi");
    expect(starterSplashPage.inputFields).toEqual([{ type: "Email" }]);
    expect(starterSplashPage.background.kind).toBe("colour");
    expect(starterSplashPage.background.colour).toMatch(hexColour);
    expect(starterSplashPage.connectButton.backgroundColour).toMatch(hexColour);
    expect(starterSplashPage.connectButton.textColour).toMatch(hexColour);
    expect(starterSplashPage.logo).toBeUndefined();
  });
});

describe("Text Blocks", () => {
  it("updating a Text Block's text changes only that Text Block's text", () => {
    const [starterTextBlock] = starterSplashPage.textBlocks;

    const splashPage = splashPageReducer(starterSplashPage, {
      type: "updateTextBlockText",
      id: starterTextBlock.id,
      text: "Welcome to the Café",
    });

    expect(splashPage.textBlocks).toEqual([
      { ...starterTextBlock, text: "Welcome to the Café" },
    ]);
    expect(splashPage.inputFields).toEqual(starterSplashPage.inputFields);
    expect(starterSplashPage.textBlocks[0].text).toBe("Free WiFi");
  });
});

describe("Input Fields", () => {
  it("adding an Input Field of an unused type appends it", () => {
    const splashPage = splashPageReducer(starterSplashPage, {
      type: "addInputField",
      inputFieldType: "Name",
    });

    expect(splashPage.inputFields).toEqual([
      { type: "Email" },
      { type: "Name" },
    ]);
  });
});
