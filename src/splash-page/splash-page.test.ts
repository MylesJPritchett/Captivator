import { describe, expect, it } from "vitest";
import {
  splashPageReducer,
  starterSplashPage,
  type SplashPage,
} from "@/splash-page";

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

  it("adding an Input Field of a type already present returns the Splash Page unchanged", () => {
    const splashPage = splashPageReducer(starterSplashPage, {
      type: "addInputField",
      inputFieldType: "Email",
    });

    expect(splashPage).toBe(starterSplashPage);
  });

  it("adding a third Input Field returns the Splash Page unchanged", () => {
    const twoInputFields: SplashPage = {
      ...starterSplashPage,
      inputFields: [{ type: "Email" }, { type: "Name" }],
    };

    const splashPage = splashPageReducer(twoInputFields, {
      type: "addInputField",
      inputFieldType: "Phone",
    });

    expect(splashPage).toBe(twoInputFields);
  });

  it("removing the last Input Field leaves a Splash Page with none", () => {
    const splashPage = splashPageReducer(starterSplashPage, {
      type: "removeInputField",
      inputFieldType: "Email",
    });

    expect(splashPage.inputFields).toEqual([]);
  });

  it("removing an Input Field frees its type to be added again", () => {
    const twoInputFields: SplashPage = {
      ...starterSplashPage,
      inputFields: [{ type: "Email" }, { type: "Name" }],
    };

    const removed = splashPageReducer(twoInputFields, {
      type: "removeInputField",
      inputFieldType: "Email",
    });
    const readded = splashPageReducer(removed, {
      type: "addInputField",
      inputFieldType: "Email",
    });

    expect(readded.inputFields).toEqual([{ type: "Name" }, { type: "Email" }]);
  });
});
