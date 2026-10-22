"use client";

import { useLayoutEffect, useState } from "react";
import { defaultAppearance, type Appearance } from "./appearance";
import { loadAppearance, saveAppearance } from "./remembered";

/**
 * The Customer's Appearance, kept on <html> for the global stylesheet and
 * remembered in this browser. Returns the Appearance (System until the
 * remembered one is read) and a function to choose another.
 */
export function useAppearance() {
  // The root layout's inline script has already put the remembered Appearance
  // on <html> before first paint. Read it into state before paint as well, so
  // the Appearance radio group agrees with it.
  const [appearance, setAppearance] = useState<Appearance>();
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only storage once after mount
    setAppearance(loadAppearance(localStorage));
  }, []);
  useLayoutEffect(() => {
    // The global stylesheet's `dark` variant keys off this attribute. Setting
    // it here as well restores it if React resets <html>, as it does on the
    // development-only Strict Mode remount.
    if (appearance) document.documentElement.dataset.appearance = appearance;
  }, [appearance]);

  function chooseAppearance(chosen: Appearance) {
    setAppearance(chosen);
    saveAppearance(localStorage, chosen);
  }

  return [appearance ?? defaultAppearance, chooseAppearance] as const;
}
