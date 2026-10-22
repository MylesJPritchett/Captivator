import { splashPageReducer, type SplashPageAction } from "./reducer";
import { starterSplashPage } from "./starter";
import type { Library, LibraryEntry, SplashPage } from "./types";

/**
 * Every change to the Library. Any action other than the Library's own is a
 * Splash Page action, for the Open Splash Page only.
 */
export type LibraryAction =
  | { type: "new" }
  | { type: "open"; id: string }
  | { type: "duplicate" }
  | SplashPageAction;

/** The name a new Splash Page starts with. */
export const untitledSplashPageName = "Untitled Splash Page";

/**
 * The only way the Library changes (ADR-0002), and the authority for its
 * domain rules. Wraps `splashPageReducer`, which changes the Open Splash Page.
 */
export function libraryReducer(
  library: Library,
  action: LibraryAction,
): Library {
  switch (action.type) {
    case "new": {
      const id = unusedId(library);
      return {
        splashPages: [
          ...library.splashPages,
          { id, name: untitledSplashPageName, splashPage: starterSplashPage },
        ],
        openSplashPageId: id,
      };
    }
    case "open":
      // The Open Splash Page is always one in the Library.
      return library.splashPages.some(({ id }) => id === action.id)
        ? { ...library, openSplashPageId: action.id }
        : library;
    case "duplicate": {
      const open = openEntry(library);
      const id = unusedId(library);
      return {
        splashPages: [
          ...library.splashPages,
          { id, name: `Copy of ${open.name}`, splashPage: open.splashPage },
        ],
        openSplashPageId: id,
      };
    }
    default:
      return withOpenSplashPage(
        library,
        splashPageReducer(openSplashPage(library), action),
      );
  }
}

/** The Splash Page the Editor and Preview are showing. */
export function openSplashPage(library: Library): SplashPage {
  return openEntry(library).splashPage;
}

/** The Open Splash Page's Library entry. */
function openEntry(library: Library): LibraryEntry {
  const entry = library.splashPages.find(
    ({ id }) => id === library.openSplashPageId,
  );
  if (!entry) throw new Error("The Library has no Open Splash Page");
  return entry;
}

/** The Library with the Open Splash Page replaced by `splashPage`. */
export function withOpenSplashPage(
  library: Library,
  splashPage: SplashPage,
): Library {
  return {
    ...library,
    splashPages: library.splashPages.map((entry) =>
      entry.id === library.openSplashPageId ? { ...entry, splashPage } : entry,
    ),
  };
}

/** An id no Splash Page in the Library has. */
function unusedId(library: Library): string {
  const ids = new Set(library.splashPages.map(({ id }) => id));
  let n = library.splashPages.length + 1;
  while (ids.has(`splash-page-${n}`)) n++;
  return `splash-page-${n}`;
}
