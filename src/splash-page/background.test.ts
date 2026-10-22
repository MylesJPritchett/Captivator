import { describe, expect, it } from "vitest";
import { splashPageReducer, starterSplashPage } from "@/splash-page";

const withImageShowing = {
  ...starterSplashPage,
  background: {
    kind: "image" as const,
    colour: "#1e3a8a",
    imageUrl: "blob:venue",
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
      imageUrl: "blob:venue",
    });
  });
});
