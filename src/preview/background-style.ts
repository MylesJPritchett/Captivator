import type { CSSProperties } from "react";
import type { Background } from "@/splash-page";

/** The CSS that paints a Background behind the Splash Page's content. */
export function backgroundStyle(background: Background): CSSProperties {
  return { backgroundColor: background.colour };
}
