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

  it("adding a Text Block appends one with the given id after the existing ones", () => {
    const splashPage = splashPageReducer(starterSplashPage, {
      type: "addTextBlock",
      id: "second",
    });

    expect(splashPage.textBlocks).toHaveLength(2);
    expect(splashPage.textBlocks[0]).toEqual(starterSplashPage.textBlocks[0]);
    expect(splashPage.textBlocks[1].id).toBe("second");
    expect(splashPage.textBlocks[1].colour).toMatch(hexColour);
    expect(splashPage.textBlocks[1].size).toBeGreaterThanOrEqual(12);
    expect(splashPage.textBlocks[1].size).toBeLessThanOrEqual(64);
    expect(starterSplashPage.textBlocks).toHaveLength(1);
  });
});
