import type { SplashPageAction } from "./reducer";
import type { InputFieldType, SplashPage } from "./types";

/** A Splash Page has at most this many Input Fields. */
export const maxInputFields = 2;

export const inputFieldTypes: readonly InputFieldType[] = [
  "Name",
  "Email",
  "Phone",
];

/**
 * The Input Field types that can be added to this Splash Page: those not yet
 * used, or none once it has the maximum number of Input Fields.
 */
export function addableInputFieldTypes(
  splashPage: SplashPage,
): InputFieldType[] {
  if (splashPage.inputFields.length >= maxInputFields) return [];
  return inputFieldTypes.filter(
    (type) =>
      !splashPage.inputFields.some((inputField) => inputField.type === type),
  );
}

export type InputFieldAction =
  | { type: "addInputField"; inputFieldType: InputFieldType }
  | { type: "removeInputField"; inputFieldType: InputFieldType };

export function inputFieldsReducer(
  splashPage: SplashPage,
  action: SplashPageAction,
): SplashPage {
  switch (action.type) {
    case "addInputField":
      if (!addableInputFieldTypes(splashPage).includes(action.inputFieldType)) {
        return splashPage;
      }
      return {
        ...splashPage,
        inputFields: [
          ...splashPage.inputFields,
          { type: action.inputFieldType },
        ],
      };
    case "removeInputField":
      return {
        ...splashPage,
        inputFields: splashPage.inputFields.filter(
          (inputField) => inputField.type !== action.inputFieldType,
        ),
      };
    default:
      return splashPage;
  }
}
