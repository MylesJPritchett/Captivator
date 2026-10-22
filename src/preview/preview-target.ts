import type { TextBlock } from "@/splash-page";

/** The element of the Splash Page a Customer clicked in the Preview. */
export type PreviewTarget =
  | { element: "logo" }
  | { element: "background" }
  | { element: "textBlock"; id: TextBlock["id"] }
  | { element: "inputFields" }
  | { element: "connectButton" };
