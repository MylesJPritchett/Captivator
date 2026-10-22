import { starterSplashPage } from "./starter";
import type { SplashPage } from "./types";

/**
 * Where the Splash Page is remembered in this browser (ADR-0003). Bump the
 * version whenever the Splash Page's shape changes; older saves are then
 * ignored rather than migrated.
 */
const storageKey = "captivator.splashPage.v1";

/** The remembered Splash Page, or the Starter Splash Page if there is none. */
export function loadSplashPage(storage: Storage): SplashPage {
  const saved = storage.getItem(storageKey);
  if (saved === null) return starterSplashPage;
  return JSON.parse(saved) as SplashPage;
}

/** Remembers the whole Splash Page, replacing any earlier one. */
export function saveSplashPage(storage: Storage, splashPage: SplashPage) {
  storage.setItem(storageKey, JSON.stringify(splashPage));
}
