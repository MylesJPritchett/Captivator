import { describe, expect, it } from "vitest";
import {
  splashPageReducer,
  starterSplashPage,
  type SplashPage,
} from "@/splash-page";

const twoInputFields: SplashPage = {
  ...starterSplashPage,
  inputFields: [{ type: "Email" }, { type: "Name" }],
};

describe("Input Fields", () => {
  it("adding an Input Field of an unused type appends it", () => {
    const splashPage = splashPageReducer(starterSplashPage, {
      type: "addInputField",
      inputFieldType: "Name",
    });

    expect(splashPage.inputFields).toEqual([
      { type: "Email" },
      { type: "Name" },
    ]);
  });

  it("adding an Input Field of a type already present returns the Splash Page unchanged", () => {
    const splashPage = splashPageReducer(starterSplashPage, {
      type: "addInputField",
      inputFieldType: "Email",
    });

    expect(splashPage).toBe(starterSplashPage);
  });

  it("adding a third Input Field returns the Splash Page unchanged", () => {
    const splashPage = splashPageReducer(twoInputFields, {
      type: "addInputField",
      inputFieldType: "Phone",
    });

    expect(splashPage).toBe(twoInputFields);
  });

  it("removing the last Input Field leaves a Splash Page with none", () => {
    const splashPage = splashPageReducer(starterSplashPage, {
      type: "removeInputField",
      inputFieldType: "Email",
    });

    expect(splashPage.inputFields).toEqual([]);
  });

  it("removing an Input Field frees its type to be added again", () => {
    const removed = splashPageReducer(twoInputFields, {
      type: "removeInputField",
      inputFieldType: "Email",
    });
    const readded = splashPageReducer(removed, {
      type: "addInputField",
      inputFieldType: "Email",
    });

    expect(readded.inputFields).toEqual([{ type: "Name" }, { type: "Email" }]);
  });
});
