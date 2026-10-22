import { focusRing } from "@/ui/focus-ring";

/*
 * Colour and state styles shared by the Editor's controls, drawn from the
 * colour tokens in globals.css so they follow the colour scheme. Sizing and
 * spacing stay with each control.
 */

/** An outlined button: Add, Remove, Reset. */
export const outlinedButtonClass = `rounded-md border border-control-border bg-control text-foreground hover:bg-control-hover disabled:cursor-not-allowed disabled:border-divider disabled:text-control-disabled ${focusRing}`;

/** A text input or select. */
export const fieldClass = `rounded-md border border-control-border bg-control text-foreground ${focusRing}`;
