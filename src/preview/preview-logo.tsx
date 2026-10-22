import type { ImageUrl } from "@/splash-page";
/** The largest box a Logo may fill, whatever the image's own dimensions. */
const maxLogoSize = { width: 200, height: 120 };

/** The Logo at the top of the Splash Page, if the Customer has uploaded one. */
export function PreviewLogo({ logo }: { logo?: ImageUrl }) {
  if (!logo) return null;

  // A plain <img>: the Logo is an in-memory object URL, which next/image
  // can't optimise.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo}
      alt="Logo"
      className="h-auto w-auto object-contain"
      style={{
        maxWidth: `${maxLogoSize.width}px`,
        maxHeight: `${maxLogoSize.height}px`,
      }}
    />
  );
}
