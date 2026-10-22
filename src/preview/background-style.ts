import type { CSSProperties } from "react";
import type { Background } from "@/splash-page";

/**
 * The CSS that paints a Background behind the Splash Page's content. The
 * colour always sits underneath, so it shows if there's no image to cover it.
 */
export function backgroundStyle(background: Background): CSSProperties {
  const colour = { backgroundColor: background.colour };
  if (background.kind !== "image" || !background.imageUrl) return colour;
  return {
    ...colour,
    backgroundImage: `url("${background.imageUrl}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}
