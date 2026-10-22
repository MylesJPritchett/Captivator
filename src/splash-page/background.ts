import type { SplashPageAction } from "./reducer";
import type { Colour, SplashPage } from "./types";

export type BackgroundAction = {
  type: "setBackgroundColour";
  colour: Colour;
};

export function backgroundReducer(
  splashPage: SplashPage,
  action: SplashPageAction,
): SplashPage {
  switch (action.type) {
    case "setBackgroundColour":
      return {
        ...splashPage,
        background: {
          ...splashPage.background,
          kind: "colour",
          colour: action.colour,
        },
      };
    default:
      return splashPage;
  }
}
