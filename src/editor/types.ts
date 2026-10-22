import type { Dispatch } from "react";
import type { LibraryAction, SplashPage } from "@/splash-page";

/** Every Editor section reads the Splash Page and dispatches actions. */
export type EditorSectionProps = {
  splashPage: SplashPage;
  dispatch: Dispatch<LibraryAction>;
};
