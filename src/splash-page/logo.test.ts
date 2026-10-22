import { describe, expect, it } from "vitest";
import { splashPageReducer, starterSplashPage } from "@/splash-page";

describe("Logo", () => {
  it("setting the Logo puts that image on the Splash Page", () => {
    const splashPage = splashPageReducer(starterSplashPage, {
      type: "setLogo",
      imageUrl: "blob:logo",
    });

    expect(splashPage).toEqual({ ...starterSplashPage, logo: "blob:logo" });
  });

  it("removing the Logo leaves a Splash Page without one", () => {
    const withLogo = { ...starterSplashPage, logo: "blob:logo" };

    const splashPage = splashPageReducer(withLogo, { type: "removeLogo" });

    expect(splashPage.logo).toBeUndefined();
    expect(splashPage).toEqual(starterSplashPage);
  });
});
