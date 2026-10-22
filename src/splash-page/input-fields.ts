import type { SplashPageAction } from "./reducer";
import type { InputFieldType, SplashPage } from "./types";

/** A Splash Page has at most this many Input Fields. */
const maxInputFields = 2;

export type InputFieldAction = {
  type: "addInputField";
  inputFieldType: InputFieldType;
};

export function inputFieldsReducer(
  splashPage: SplashPage,
  action: SplashPageAction,
): SplashPage {
  switch (action.type) {
    case "addInputField":
      if (
        splashPage.inputFields.length >= maxInputFields ||
        splashPage.inputFields.some(
          (inputField) => inputField.type === action.inputFieldType,
        )
      ) {
        return splashPage;
      }
      return {
        ...splashPage,
        inputFields: [
          ...splashPage.inputFields,
          { type: action.inputFieldType },
        ],
      };
    default:
      return splashPage;
  }
}
