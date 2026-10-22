import { describe, expect, it } from "vitest";
import { splashPageReducer, starterSplashPage } from "@/splash-page";

const withImageShowing = {
  ...starterSplashPage,
  background: {
    kind: "image" as const,
    colour: "#1e3a8a",
    imageUrl: "data:image/png;base64,dmVudWU=",
  },
};

describe("Background", () => {
  it("setting the Background colour switches to colour and keeps the uploaded image", () => {
    const splashPage = splashPageReducer(withImageShowing, {
      type: "setBackgroundColour",
      colour: "#10b981",
    });

    expect(splashPage.background).toEqual({
      kind: "colour",
      colour: "#10b981",
      imageUrl: "data:image/png;base64,dmVudWU=",
    });
  });

  it("setting the Background image switches to image and keeps the colour", () => {
    const splashPage = splashPageReducer(starterSplashPage, {
      type: "setBackgroundImage",
      imageUrl: "data:image/png;base64,dmVudWU=",
    });

    expect(splashPage.background).toEqual({
      kind: "image",
      colour: "#1e3a8a",
      imageUrl: "data:image/png;base64,dmVudWU=",
    });
  });

  it("switching the Background between colour and image never loses either value", () => {
    const showingColour = splashPageReducer(withImageShowing, {
      type: "setBackgroundKind",
      kind: "colour",
    });
    expect(showingColour.background).toEqual({
      kind: "colour",
      colour: "#1e3a8a",
      imageUrl: "data:image/png;base64,dmVudWU=",
    });

    const showingImageAgain = splashPageReducer(showingColour, {
      type: "setBackgroundKind",
      kind: "image",
    });
    expect(showingImageAgain.background).toEqual(withImageShowing.background);
  });
});
