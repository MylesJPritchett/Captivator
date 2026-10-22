import type { SplashPageAction } from "./reducer";
import type { Colour, SplashPage } from "./types";

export type ConnectButtonAction =
  | { type: "setConnectButtonBackgroundColour"; colour: Colour }
  | { type: "setConnectButtonTextColour"; colour: Colour };

export function connectButtonReducer(
  splashPage: SplashPage,
  action: SplashPageAction,
): SplashPage {
  switch (action.type) {
    case "setConnectButtonBackgroundColour":
      return {
        ...splashPage,
        connectButton: {
          ...splashPage.connectButton,
          backgroundColour: action.colour,
        },
      };
    case "setConnectButtonTextColour":
      return {
        ...splashPage,
        connectButton: {
          ...splashPage.connectButton,
          textColour: action.colour,
        },
      };
    default:
      return splashPage;
  }
}
