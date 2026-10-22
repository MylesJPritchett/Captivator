/** The Logo at the top of the Splash Page, if the Customer has uploaded one. */
export function PreviewLogo({ logo }: { logo?: string }) {
  if (!logo) return null;

  // A plain <img>: the Logo is an in-memory object URL, which next/image
  // can't optimise.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={logo} alt="Logo" />;
}
