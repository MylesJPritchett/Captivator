import { describe, expect, it } from "vitest";
import { starterLibrary, starterSplashPage } from "@/splash-page";

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

describe("starter Library", () => {
  it("holds one Starter Splash Page, named My Splash Page and open", () => {
    expect(starterLibrary.splashPages).toEqual([
      expect.objectContaining({
        name: "My Splash Page",
        splashPage: starterSplashPage,
      }),
    ]);
    expect(starterLibrary.openSplashPageId).toBe(
      starterLibrary.splashPages[0].id,
    );
  });
});
