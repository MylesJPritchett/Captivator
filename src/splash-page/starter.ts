import type { Library, SplashPage } from "./types";

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

/** The name a Library's first Splash Page starts with. */
export const firstSplashPageName = "My Splash Page";

/** Starts a Library holding one Splash Page, named "My Splash Page" and open. */
export function libraryOf(splashPage: SplashPage): Library {
  const id = "my-splash-page";
  return {
    splashPages: [{ id, name: firstSplashPageName, splashPage }],
    openSplashPageId: id,
  };
}

/** The Library the Editor opens on the first time: one Starter Splash Page. */
export const starterLibrary: Library = libraryOf(starterSplashPage);
