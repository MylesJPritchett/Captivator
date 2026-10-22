import { describe, expect, it } from "vitest";
import { splashPageReducer, starterSplashPage } from "@/splash-page";

describe("Logo", () => {
  it("setting the Logo puts that image on the Splash Page", () => {
    const splashPage = splashPageReducer(starterSplashPage, {
      type: "setLogo",
      imageUrl: "data:image/png;base64,bG9nbw==",
    });

    expect(splashPage).toEqual({
      ...starterSplashPage,
      logo: "data:image/png;base64,bG9nbw==",
    });
  });

  it("removing the Logo leaves a Splash Page without one", () => {
    const withLogo = {
      ...starterSplashPage,
      logo: "data:image/png;base64,bG9nbw==",
    };

    const splashPage = splashPageReducer(withLogo, { type: "removeLogo" });

    expect(splashPage.logo).toBeUndefined();
    expect(splashPage).toEqual(starterSplashPage);
  });
});
