import { focusRing } from "./focus-ring";

/*
 * Colour and state styles shared by the Editor's controls, drawn from the
 * colour tokens in globals.css so they follow the colour scheme. Sizing and
 * spacing stay with each control.
 */

/** An outlined button: Add, Remove, Reset. */
export const buttonClass = `rounded-md border border-control-border bg-control text-foreground hover:bg-control-hover ${focusRing}`;

/** The filled button for the one emphasised action in a group. */
export const primaryButtonClass = `rounded-md bg-primary text-primary-foreground hover:bg-primary-hover ${focusRing}`;

/** A text input or select. */
export const fieldClass = `rounded-md border border-control-border bg-control text-foreground ${focusRing}`;
