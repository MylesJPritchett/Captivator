/**
 * How the tool looks to the Customer: Light, Dark, or following their System
 * colour scheme. Not part of the Splash Page.
 */
export const appearances = ["light", "system", "dark"] as const;

export type Appearance = (typeof appearances)[number];

export const defaultAppearance: Appearance = "system";

export function isAppearance(value: unknown): value is Appearance {
  return appearances.includes(value as Appearance);
}
