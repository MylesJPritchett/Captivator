import type { Dispatch } from "react";
import type { SplashPage, SplashPageAction } from "@/splash-page";

/** Every Editor section reads the Splash Page and dispatches actions. */
export type EditorSectionProps = {
  splashPage: SplashPage;
  dispatch: Dispatch<SplashPageAction>;
};
