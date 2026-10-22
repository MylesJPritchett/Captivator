import type { SplashPage } from "./types";

// No Connect Button actions yet. Replace `never` with a union of Connect Button actions.
export type ConnectButtonAction = never;

export function connectButtonReducer(splashPage: SplashPage): SplashPage {
  return splashPage;
}
