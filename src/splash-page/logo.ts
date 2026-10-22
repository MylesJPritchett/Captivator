import type { SplashPageAction } from "./reducer";
import type { SplashPage } from "./types";

export type LogoAction =
  | { type: "setLogo"; imageUrl: string }
  | { type: "removeLogo" };

export function logoReducer(
  splashPage: SplashPage,
  action: SplashPageAction,
): SplashPage {
  switch (action.type) {
    case "setLogo":
      return { ...splashPage, logo: action.imageUrl };
    case "removeLogo": {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { logo, ...withoutLogo } = splashPage;
      return withoutLogo;
    }
    default:
      return splashPage;
  }
}
