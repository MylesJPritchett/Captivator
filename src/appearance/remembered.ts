import { defaultAppearance, type Appearance } from "./appearance";

/**
 * Where the Customer's Appearance is remembered in this browser, apart from
 * the Splash Page. Bump the version whenever the stored value's shape
 * changes; older values are then ignored.
 */
export const savedAppearanceKey = "captivator.appearance.v1";

/** The remembered Appearance, or System if there is none or it can't be read. */
export function loadAppearance(storage: Storage): Appearance {
  try {
    // Throws if this browser blocks storage.
    const saved = storage.getItem(savedAppearanceKey);
    return saved === "light" || saved === "dark" ? saved : defaultAppearance;
  } catch {
    return defaultAppearance;
  }
}

/**
 * An inline script for the root layout's <head>, which puts the remembered
 * Appearance on <html> while the page is parsed, before first paint, so a
 * reload never flashes the other colour scheme. Reads like `loadAppearance`;
 * System needs no attribute, so it sets none.
 */
export const applyRememberedAppearanceScript = `try{var a=localStorage.getItem(${JSON.stringify(savedAppearanceKey)});if(a==="light"||a==="dark")document.documentElement.dataset.appearance=a}catch(e){}`;

/** Remembers the Appearance if this browser lets it. Never throws. */
export function saveAppearance(storage: Storage, appearance: Appearance) {
  try {
    storage.setItem(savedAppearanceKey, appearance);
  } catch {
    // Storage is blocked or full: the Appearance lasts only this session.
  }
}
