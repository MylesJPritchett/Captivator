import { inputFieldTypes, maxInputFields } from "./input-fields";
import { starterSplashPage } from "./starter";
import type {
  Background,
  ConnectButton,
  InputField,
  SplashPage,
  TextBlock,
} from "./types";

/**
 * Where the Splash Page is remembered in this browser (ADR-0003). Bump the
 * version whenever the Splash Page's shape changes; older saves are then
 * ignored rather than migrated.
 */
export const savedSplashPageKey = "captivator.splashPage.v1";

/**
 * The remembered Splash Page, or the Starter Splash Page if there is none or
 * it can't be read.
 */
export function loadSplashPage(storage: Storage): SplashPage {
  try {
    // Throws if this browser blocks storage.
    const saved = storage.getItem(savedSplashPageKey);
    if (saved === null) return starterSplashPage;
    const parsed: unknown = JSON.parse(saved);
    return isSplashPage(parsed) ? parsed : starterSplashPage;
  } catch {
    return starterSplashPage;
  }
}

/**
 * How much of the Splash Page was remembered: all of it; when this browser's
 * storage is full, everything except its Logo and Background image; or, when
 * storage is blocked or even that doesn't fit, nothing.
 */
export type SaveResult = "saved" | "saved without images" | "not saved";

/**
 * Remembers the whole Splash Page, replacing any earlier one. If storage is
 * full, remembers it without its images instead (ADR-0003). Never throws.
 */
export function saveSplashPage(
  storage: Storage,
  splashPage: SplashPage,
): SaveResult {
  try {
    storage.setItem(savedSplashPageKey, JSON.stringify(splashPage));
    return "saved";
  } catch (error) {
    if (!isQuotaExceeded(error)) return "not saved";
  }
  try {
    storage.setItem(
      savedSplashPageKey,
      JSON.stringify(withoutImages(splashPage)),
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
    isOptionalString(value.imageUrl) &&
    // An image Background always has an image to show.
    (value.kind === "colour" || isString(value.imageUrl))
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
