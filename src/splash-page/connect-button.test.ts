import { describe, expect, it } from "vitest";
import { splashPageReducer, starterSplashPage } from "@/splash-page";

describe("Connect Button", () => {
  it("setting the Connect Button background colour changes only that colour", () => {
    const splashPage = splashPageReducer(starterSplashPage, {
      type: "setConnectButtonBackgroundColour",
      colour: "#10b981",
    });

    expect(splashPage.connectButton).toEqual({
      backgroundColour: "#10b981",
      textColour: starterSplashPage.connectButton.textColour,
    });
    expect(splashPage.textBlocks).toEqual(starterSplashPage.textBlocks);
  });
});
