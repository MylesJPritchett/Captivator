import { describe, expect, it } from "vitest";
import {
  libraryReducer,
  starterSplashPage,
  type Library,
  type SplashPage,
} from "@/splash-page";

const cafe: SplashPage = {
  ...starterSplashPage,
  textBlocks: [
    { id: "cafe", text: "Welcome to the Café", colour: "#111827", size: 24 },
  ],
};

const bar: SplashPage = {
  ...starterSplashPage,
  textBlocks: [{ id: "bar", text: "Happy hour", colour: "#ef4444", size: 30 }],
};

/** A Library of the Café and Bar Splash Pages, with the Café open. */
const cafeAndBar: Library = {
  splashPages: [
    { id: "cafe", name: "Café", splashPage: cafe },
    { id: "bar", name: "Bar", splashPage: bar },
  ],
  openSplashPageId: "cafe",
};

describe("Library", () => {
  it("New adds a Starter Splash Page named Untitled Splash Page at the bottom of the Library and opens it", () => {
    const library = libraryReducer(cafeAndBar, { type: "new" });

    expect(library.splashPages).toHaveLength(3);
    expect(library.splashPages.slice(0, 2)).toEqual(cafeAndBar.splashPages);
    const added = library.splashPages[2];
    expect(added).toMatchObject({
      name: "Untitled Splash Page",
      splashPage: starterSplashPage,
    });
    expect(["cafe", "bar"]).not.toContain(added.id);
    expect(library.openSplashPageId).toBe(added.id);
  });

  it("Open makes another Splash Page the Open Splash Page and changes no Splash Page", () => {
    const library = libraryReducer(cafeAndBar, { type: "open", id: "bar" });

    expect(library).toEqual({ ...cafeAndBar, openSplashPageId: "bar" });
  });

  it("opening a Splash Page that isn't in the Library leaves the Library unchanged", () => {
    const library = libraryReducer(cafeAndBar, { type: "open", id: "gone" });

    expect(library).toEqual(cafeAndBar);
  });

  it("a Splash Page action changes only the Open Splash Page", () => {
    const library = libraryReducer(
      { ...cafeAndBar, openSplashPageId: "bar" },
      { type: "setBackgroundColour", colour: "#10b981" },
    );

    expect(library).toEqual({
      splashPages: [
        { id: "cafe", name: "Café", splashPage: cafe },
        {
          id: "bar",
          name: "Bar",
          splashPage: {
            ...bar,
            background: { kind: "colour", colour: "#10b981" },
          },
        },
      ],
      openSplashPageId: "bar",
    });
  });

  it("Reset returns only the Open Splash Page to the Starter Splash Page, and keeps its name", () => {
    const library = libraryReducer(cafeAndBar, { type: "reset" });

    expect(library.splashPages).toEqual([
      { id: "cafe", name: "Café", splashPage: starterSplashPage },
      { id: "bar", name: "Bar", splashPage: bar },
    ]);
  });

  it("Rename renames only the Open Splash Page, trimming the name", () => {
    const library = libraryReducer(cafeAndBar, {
      type: "rename",
      name: "  Corner Café  ",
    });

    expect(library).toEqual({
      ...cafeAndBar,
      splashPages: [
        { id: "cafe", name: "Corner Café", splashPage: cafe },
        { id: "bar", name: "Bar", splashPage: bar },
      ],
    });
  });

  it("renaming the Open Splash Page to a blank name names it Untitled Splash Page", () => {
    const library = libraryReducer(cafeAndBar, { type: "rename", name: "   " });

    expect(library.splashPages[0].name).toBe("Untitled Splash Page");
  });

  it("two Splash Pages may share a name", () => {
    const library = libraryReducer(cafeAndBar, { type: "rename", name: "Bar" });

    expect(library.splashPages.map(({ name }) => name)).toEqual(["Bar", "Bar"]);
  });

  it("Duplicate adds a copy of the Open Splash Page, images included, named Copy of its name at the bottom of the Library and opens it", () => {
    const withImages: Library = {
      ...cafeAndBar,
      splashPages: [
        {
          id: "cafe",
          name: "Café",
          splashPage: {
            ...cafe,
            logo: "data:image/png;base64,logo",
            background: {
              kind: "image",
              colour: "#ffffff",
              imageUrl: "data:image/png;base64,background",
            },
          },
        },
        cafeAndBar.splashPages[1],
      ],
    };

    const library = libraryReducer(withImages, { type: "duplicate" });

    expect(library.splashPages).toHaveLength(3);
    expect(library.splashPages.slice(0, 2)).toEqual(withImages.splashPages);
    const copy = library.splashPages[2];
    expect(copy).toMatchObject({
      name: "Copy of Café",
      splashPage: withImages.splashPages[0].splashPage,
    });
    expect(["cafe", "bar"]).not.toContain(copy.id);
    expect(library.openSplashPageId).toBe(copy.id);
  });

  it("Delete removes the Open Splash Page and opens the Splash Page just above it", () => {
    const library = libraryReducer(
      { ...cafeAndBar, openSplashPageId: "bar" },
      { type: "delete" },
    );

    expect(library).toEqual({
      splashPages: [{ id: "cafe", name: "Café", splashPage: cafe }],
      openSplashPageId: "cafe",
    });
  });

  it("deleting the first Splash Page opens the next one down", () => {
    const library = libraryReducer(cafeAndBar, { type: "delete" });

    expect(library).toEqual({
      splashPages: [{ id: "bar", name: "Bar", splashPage: bar }],
      openSplashPageId: "bar",
    });
  });

  it("deleting the only Splash Page leaves a single Starter Splash Page named Untitled Splash Page", () => {
    const library = libraryReducer(
      {
        splashPages: [{ id: "cafe", name: "Café", splashPage: cafe }],
        openSplashPageId: "cafe",
      },
      { type: "delete" },
    );

    expect(library.splashPages).toHaveLength(1);
    expect(library.splashPages[0]).toMatchObject({
      name: "Untitled Splash Page",
      splashPage: starterSplashPage,
    });
    expect(library.openSplashPageId).toBe(library.splashPages[0].id);
  });
});
