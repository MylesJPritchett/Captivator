import { backgroundReducer, type BackgroundAction } from "./background";
import {
  connectButtonReducer,
  type ConnectButtonAction,
} from "./connect-button";
import { inputFieldsReducer, type InputFieldAction } from "./input-fields";
import { logoReducer, type LogoAction } from "./logo";
import { resetReducer, type ResetAction } from "./reset";
import { textBlocksReducer, type TextBlockAction } from "./text-blocks";
import type { SplashPage } from "./types";

/**
 * Every change to a Splash Page. Each glossary area owns its actions and its
 * reducer in its own file; add new actions there, not here.
 */
export type SplashPageAction =
  | LogoAction
  | BackgroundAction
  | TextBlockAction
  | InputFieldAction
  | ConnectButtonAction
  | ResetAction;

type AreaReducer = (
  splashPage: SplashPage,
  action: SplashPageAction,
) => SplashPage;

const areaReducers: AreaReducer[] = [
  logoReducer,
  backgroundReducer,
  textBlocksReducer,
  inputFieldsReducer,
  connectButtonReducer,
  resetReducer,
];

/**
 * The only way a Splash Page changes (ADR-0002), and the authority for its
 * domain rules. Each area reducer returns the Splash Page unchanged for
 * actions it doesn't own.
 */
export function splashPageReducer(
  splashPage: SplashPage,
  action: SplashPageAction,
): SplashPage {
  return areaReducers.reduce(
    (current, areaReducer) => areaReducer(current, action),
    splashPage,
  );
}
