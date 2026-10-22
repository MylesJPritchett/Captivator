import type { SplashPage } from "./types";

// No Input Field actions yet. Replace `never` with a union of Input Field actions.
export type InputFieldAction = never;

export function inputFieldsReducer(splashPage: SplashPage): SplashPage {
  return splashPage;
}
