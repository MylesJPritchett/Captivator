import { get, set } from "idb-keyval";
import { inputFieldTypes, maxInputFields } from "./input-fields";
import { libraryOf, starterLibrary } from "./starter";
import type {
  Background,
  ConnectButton,
  InputField,
  Library,
  LibraryEntry,
  SplashPage,
  TextBlock,
} from "./types";

/**
 * Where ADR-0003 remembered the Splash Page, in this browser's localStorage.
 * Read only to carry an earlier visit's Splash Page into the Library.
 */
export const savedSplashPageKey = "captivator.splashPage.v1";

/**
 * Where the Library is remembered in this browser's IndexedDB (ADR-0004).
 * Bump the version whenever the Library's or a Splash Page's shape changes;
 * older saves are then ignored rather than migrated.
 */
export const savedLibraryKey = "captivator.library.v1";

/**
 * The remembered Library, or a Library holding one Starter Splash Page if
 * there is none or it can't be read. With no Library saved yet, a Splash Page
 * ADR-0003 remembered in `legacyStorage` becomes its only Splash Page.
 * Never rejects.
 */
export async function loadLibrary(legacyStorage: Storage): Promise<Library> {
  try {
    // Rejects if this browser blocks storage.
    const saved: unknown = await get(savedLibraryKey);
    // Awaited so that anything carrying over throws is caught here.
    if (saved === undefined) return await carryOver(legacyStorage);
    const parsed = typeof saved === "string" ? parseJson(saved) : undefined;
    return isLibrary(parsed) ? parsed : starterLibrary;
  } catch {
    return starterLibrary;
  }
}

/**
 * A Library holding the Splash Page ADR-0003 remembered in `legacyStorage`,
 * or one Starter Splash Page if there is none or it can't be read. Once the
 * Library holding it is saved, the Splash Page is removed from
 * `legacyStorage`, so it's carried over only once (ADR-0004).
 */
async function carryOver(legacyStorage: Storage): Promise<Library> {
  // Throws if this browser blocks storage.
  const saved = legacyStorage.getItem(savedSplashPageKey);
  if (saved === null) return starterLibrary;
  const parsed = parseJson(saved);
  if (!isSplashPage(parsed)) return starterLibrary;
  const library = libraryOf(parsed);
  if ((await saveLibrary(library)) === "saved") {
    legacyStorage.removeItem(savedSplashPageKey);
  }
  return library;
}

/** `text` parsed as JSON, or undefined if it isn't JSON. */
function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/** The Splash Page the Editor and Preview are showing. */
export function openSplashPage(library: Library): SplashPage {
  return openEntry(library).splashPage;
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

function openEntry(library: Library): LibraryEntry {
  const entry = library.splashPages.find(
    ({ id }) => id === library.openSplashPageId,
  );
  if (!entry) throw new Error("The Library has no Open Splash Page");
  return entry;
}

/**
 * How much of the Library was remembered: all of it; when this browser's
 * storage is full, everything except the Open Splash Page's Logo and
 * Background image; or, when storage is blocked or even that doesn't fit,
 * nothing.
 */
export type SaveResult = "saved" | "saved without images" | "not saved";

/** Every save made so far, settling once the last has gone through. */
let saves: Promise<unknown> = Promise.resolve();

/**
 * Remembers the whole Library, replacing any earlier one. If storage is full,
 * remembers it without the Open Splash Page's images instead (ADR-0003).
 * Saves go through one after another in the order they're made, so the
 * latest Library is the one remembered (ADR-0004). Never rejects.
 */
export function saveLibrary(library: Library): Promise<SaveResult> {
  const save = saves.then(() => writeLibrary(library));
  saves = save;
  return save;
}

/** Settles once every save made so far has gone through. */
export async function savesSettled(): Promise<void> {
  await saves;
}

async function writeLibrary(library: Library): Promise<SaveResult> {
  try {
    await set(savedLibraryKey, JSON.stringify(library));
    return "saved";
  } catch (error) {
    if (!isQuotaExceeded(error)) return "not saved";
  }
  try {
    const splashPage = withoutImages(openSplashPage(library));
    await set(
      savedLibraryKey,
      JSON.stringify(withOpenSplashPage(library, splashPage)),
    );
    return "saved without images";
  } catch {
    return "not saved";
  }
}

/** The Splash Page without its Logo or Background image. */
function withoutImages(splashPage: SplashPage): SplashPage {
  return {
    ...splashPage,
    logo: undefined,
    // The colour always sits underneath, so it's what shows instead.
    background: { kind: "colour", colour: splashPage.background.colour },
  };
}

/** Whether a storage write failed because storage is full. */
function isQuotaExceeded(error: unknown) {
  return (
    error instanceof DOMException &&
    (error.name === "QuotaExceededError" ||
      // Older Firefox
      error.name === "NS_ERROR_DOM_QUOTA_REACHED")
  );
}

type Fields = Record<string, unknown>;

function isObject(value: unknown): value is Fields {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const isString = (value: unknown) => typeof value === "string";
const isOptionalString = (value: unknown) =>
  value === undefined || isString(value);

function isBackground(value: unknown): value is Background {
  return (
    isObject(value) &&
    (value.kind === "colour" || value.kind === "image") &&
    isString(value.colour) &&
    // An image Background may have no image yet: the Customer can switch to
    // image before uploading one, and the colour shows until they do.
    isOptionalString(value.imageUrl)
  );
}

function isTextBlock(value: unknown): value is TextBlock {
  return (
    isObject(value) &&
    isString(value.id) &&
    isString(value.text) &&
    isString(value.colour) &&
    typeof value.size === "number"
  );
}

function isInputField(value: unknown): value is InputField {
  return (
    isObject(value) &&
    inputFieldTypes.includes(value.type as InputField["type"])
  );
}

/** At most `maxInputFields` Input Fields, never two of the same type. */
function isInputFields(value: unknown): value is InputField[] {
  return (
    Array.isArray(value) &&
    value.length <= maxInputFields &&
    value.every(isInputField) &&
    new Set(value.map((inputField) => inputField.type)).size === value.length
  );
}

function isConnectButton(value: unknown): value is ConnectButton {
  return (
    isObject(value) &&
    isString(value.backgroundColour) &&
    isString(value.textColour)
  );
}

/**
 * Whether a parsed save has the shape of a Splash Page and keeps the
 * reducer's domain rules.
 */
function isSplashPage(value: unknown): value is SplashPage {
  return (
    isObject(value) &&
    isOptionalString(value.logo) &&
    isBackground(value.background) &&
    Array.isArray(value.textBlocks) &&
    value.textBlocks.every(isTextBlock) &&
    isInputFields(value.inputFields) &&
    isConnectButton(value.connectButton)
  );
}

function isLibraryEntry(value: unknown): value is LibraryEntry {
  return (
    isObject(value) &&
    isString(value.id) &&
    isString(value.name) &&
    isSplashPage(value.splashPage)
  );
}

/**
 * Whether a parsed save has the shape of a Library: never empty, and its Open
 * Splash Page is one of its Splash Pages.
 */
function isLibrary(value: unknown): value is Library {
  return (
    isObject(value) &&
    Array.isArray(value.splashPages) &&
    value.splashPages.length > 0 &&
    value.splashPages.every(isLibraryEntry) &&
    value.splashPages.some(({ id }) => id === value.openSplashPageId)
  );
}
