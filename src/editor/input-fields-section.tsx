import { useState } from "react";
import { addableInputFieldTypes, type InputFieldType } from "@/splash-page";
import { buttonClass, fieldClass, primaryButtonClass } from "@/ui/controls";
import { EditorSection } from "./editor-section";
import type { EditorSectionProps } from "./types";

export function InputFieldsSection({
  splashPage,
  dispatch,
}: EditorSectionProps) {
  const addableTypes = addableInputFieldTypes(splashPage);
  const [chosenType, setChosenType] = useState<InputFieldType>();
  const newType =
    chosenType && addableTypes.includes(chosenType)
      ? chosenType
      : addableTypes[0];

  return (
    <EditorSection title="Input Fields" area="inputFields">
      {splashPage.inputFields.length > 0 && (
        <ul className="flex flex-col gap-2">
          {splashPage.inputFields.map((inputField) => (
            <li
              key={inputField.type}
              className="flex items-center justify-between rounded-md border border-divider px-3 py-2"
            >
              <span className="text-sm">{inputField.type}</span>
              <button
                type="button"
                aria-label={`Remove ${inputField.type} Input Field`}
                onClick={() =>
                  dispatch({
                    type: "removeInputField",
                    inputFieldType: inputField.type,
                  })
                }
                className={`px-2 py-1 text-sm ${buttonClass}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      {newType && (
        <div className="flex items-end gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <label
              htmlFor="new-input-field-type"
              className="text-sm font-medium"
            >
              Input Field type
            </label>
            <select
              id="new-input-field-type"
              value={newType}
              onChange={(event) =>
                setChosenType(event.target.value as InputFieldType)
              }
              className={`px-3 py-2 ${fieldClass}`}
            >
              {addableTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() =>
              dispatch({ type: "addInputField", inputFieldType: newType })
            }
            className={`px-3 py-2 text-sm font-medium ${primaryButtonClass}`}
          >
            Add Input Field
          </button>
        </div>
      )}
    </EditorSection>
  );
}
