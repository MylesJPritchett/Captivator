/*
 * The visible keyboard focus style every control shares. Tailwind only finds
 * classes written out in full, so each variant spells out the same ring; keep
 * them in step.
 */

/** The ring on a control that has keyboard focus. */
export const focusRing = "focus-visible:outline-2 focus-visible:outline-focus";

/**
 * The same ring on an element wrapping the focused control, e.g. the label
 * of a SegmentedControl's visually hidden radio.
 */
export const focusWithinRing =
  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus";
