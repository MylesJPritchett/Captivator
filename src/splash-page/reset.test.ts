import { describe, expect, it } from "vitest";
import { splashPageReducer, type SplashPage } from "@/splash-page";

const heavilyEdited: SplashPage = {
  logo: "data:image/png;base64,bG9nbw==",
  background: {
    kind: "image",
    colour: "#10b981",
    imageUrl: "data:image/png;base64,dmVudWU=",
  },
  textBlocks: [
    { id: "a", text: "Welcome to the Café", colour: "#111827", size: 24 },
    { id: "b", text: "Ask staff for help", colour: "#ef4444", size: 16 },
  ],
  inputFields: [{ type: "Name" }, { type: "Phone" }],
  connectButton: { backgroundColour: "#000000", textColour: "#fde68a" },
};

describe("Reset", () => {
  it("resetting a heavily edited Splash Page returns the Starter Splash Page", () => {
    const splashPage = splashPageReducer(heavilyEdited, { type: "reset" });

    expect(splashPage).toEqual({
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
    });
  });
});
