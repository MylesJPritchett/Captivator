import type { SplashPageAction } from "./reducer";
import { starterSplashPage } from "./starter";
import type { SplashPage } from "./types";

export type ResetAction = { type: "reset" };

/** Reset returns the Starter Splash Page, whatever the current Splash Page. */
export function resetReducer(
  splashPage: SplashPage,
  action: SplashPageAction,
): SplashPage {
  return action.type === "reset" ? starterSplashPage : splashPage;
}
