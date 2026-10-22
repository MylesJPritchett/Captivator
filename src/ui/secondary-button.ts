import { focusRing } from "./focus-ring";

/**
 * The outlined style of the Editor's and the Library's secondary buttons,
 * such as Reset, Duplicate and New Splash Page, focus ring included. Its
 * colours come from the tokens in globals.css, so it follows the Appearance.
 */
export const secondaryButton = `rounded-md border border-control-border bg-control px-3 py-2 text-sm font-medium text-foreground hover:bg-control-hover disabled:cursor-not-allowed disabled:border-divider disabled:text-control-disabled ${focusRing}`;
