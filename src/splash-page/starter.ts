import type { SplashPage } from "./types";

/** The ready-made Splash Page the Editor opens on. */
export const starterSplashPage: SplashPage = {
  background: { kind: "colour", colour: "#1e3a8a" },
  textBlocks: [
    {
      id: "starter-text-block",
      text: "Free WiFi",
      colour: "#ffffff",
      size: 36,
    },
  ],
  inputFields: [{ type: "Email" }],
  connectButton: { backgroundColour: "#f59e0b", textColour: "#ffffff" },
};
