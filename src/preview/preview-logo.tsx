import type { ImageUrl } from "@/splash-page";
import { jumpCue } from "./jump-cue";

/** The largest box a Logo may fill, whatever the image's own dimensions. */
const maxLogoSize = { width: 200, height: 120 };

/**
 * The Logo at the top of the Splash Page, if the Customer has uploaded one.
 * Clicking it jumps to the Editor; it's pointer-only, with no tab stop.
 */
export function PreviewLogo({
  logo,
  onClick,
}: {
  logo?: ImageUrl;
  onClick: () => void;
}) {
  if (!logo) return null;

  // A plain <img>: the Logo is an in-memory object URL, which next/image
  // can't optimise.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo}
      alt="Logo"
      onClick={onClick}
      className={`h-auto w-auto object-contain ${jumpCue}`}
      style={{
        maxWidth: `${maxLogoSize.width}px`,
        maxHeight: `${maxLogoSize.height}px`,
      }}
    />
  );
}
