import type { SplashPageAction } from "./reducer";
import type { Background, Colour, ImageUrl, SplashPage } from "./types";

export type BackgroundAction =
  | { type: "setBackgroundColour"; colour: Colour }
  | { type: "setBackgroundImage"; imageUrl: ImageUrl }
  | { type: "setBackgroundKind"; kind: Background["kind"] };

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
    case "setBackgroundImage":
      return {
        ...splashPage,
        background: {
          ...splashPage.background,
          kind: "image",
          imageUrl: action.imageUrl,
        },
      };
    case "setBackgroundKind":
      return {
        ...splashPage,
        background: { ...splashPage.background, kind: action.kind },
      };
    default:
      return splashPage;
  }
}
