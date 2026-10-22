import type { SplashPage } from "./types";

// No Logo actions yet. Replace `never` with a union of Logo actions.
export type LogoAction = never;

export function logoReducer(splashPage: SplashPage): SplashPage {
  return splashPage;
}
