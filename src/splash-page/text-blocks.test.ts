import { describe, expect, it } from "vitest";
import {
  splashPageReducer,
  starterSplashPage,
  type SplashPageAction,
} from "@/splash-page";

const hexColour = /^#[0-9a-f]{6}$/i;

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

  it("updating a Text Block's colour changes only that Text Block's colour", () => {
    const [starterTextBlock] = starterSplashPage.textBlocks;

    const splashPage = splashPageReducer(starterSplashPage, {
      type: "updateTextBlockColour",
      id: starterTextBlock.id,
      colour: "#ff0000",
    });

    expect(splashPage.textBlocks).toEqual([
      { ...starterTextBlock, colour: "#ff0000" },
    ]);
  });

  it.each([
    [40, 40],
    [12, 12],
    [64, 64],
    [5, 12],
    [100, 64],
  ])(
    "updating a Text Block's size to %ipx sets it to %ipx (clamped to 12–64px)",
    (requested, expected) => {
      const [starterTextBlock] = starterSplashPage.textBlocks;

      const splashPage = splashPageReducer(starterSplashPage, {
        type: "updateTextBlockSize",
        id: starterTextBlock.id,
        size: requested,
      });

      expect(splashPage.textBlocks).toEqual([
        { ...starterTextBlock, size: expected },
      ]);
    },
  );

  it("removing the last Text Block leaves a Splash Page with no Text Blocks", () => {
    const splashPage = splashPageReducer(starterSplashPage, {
      type: "removeTextBlock",
      id: starterSplashPage.textBlocks[0].id,
    });

    expect(splashPage.textBlocks).toEqual([]);
    expect(starterSplashPage.textBlocks).toHaveLength(1);
  });

  it("removing a Text Block keeps the others in order", () => {
    const withThree = [
      { type: "addTextBlock", id: "second" },
      { type: "addTextBlock", id: "third" },
    ].reduce(
      (current, action) =>
        splashPageReducer(current, action as SplashPageAction),
      starterSplashPage,
    );

    const splashPage = splashPageReducer(withThree, {
      type: "removeTextBlock",
      id: "second",
    });

    expect(splashPage.textBlocks.map((textBlock) => textBlock.id)).toEqual([
      starterSplashPage.textBlocks[0].id,
      "third",
    ]);
  });
});
