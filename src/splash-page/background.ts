import type { SplashPage } from "./types";

// No Background actions yet. Replace `never` with a union of Background actions.
export type BackgroundAction = never;

export function backgroundReducer(splashPage: SplashPage): SplashPage {
  return splashPage;
}
