import { useState, type Dispatch } from "react";
import { splashPageName, type LibraryAction } from "@/splash-page";
import { fieldClass } from "./controls";

/** The id of the Splash Page name field, so focus can be moved to it. */
export const nameFieldId = "splash-page-name";

/**
 * Names the Open Splash Page. The name shows in the Library, never in the
 * Preview.
 */
export function NameField({
  splashPageId,
  name,
  dispatch,
}: {
  /** The Open Splash Page's id, so opening another shows its name. */
  splashPageId: string;
  name: string;
  dispatch: Dispatch<LibraryAction>;
}) {
  // What the Customer typed into this Splash Page's name, which may differ
  // from the name by the spaces and blankness that renaming tidies away.
  // Anything else, such as opening another Splash Page, shows the name itself.
  const [draft, setDraft] = useState({ splashPageId, text: name });
  if (
    draft.splashPageId !== splashPageId ||
    splashPageName(draft.text) !== name
  ) {
    setDraft({ splashPageId, text: name });
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={nameFieldId} className="text-sm font-medium">
        Splash Page name
      </label>
      <input
        id={nameFieldId}
        type="text"
        value={draft.text}
        onChange={(event) => {
          setDraft({ splashPageId, text: event.target.value });
          dispatch({ type: "rename", name: event.target.value });
        }}
        onBlur={() => setDraft({ splashPageId, text: name })}
        className={`px-3 py-2 ${fieldClass}`}
      />
    </div>
  );
}

/** Moves focus to the Splash Page name field, ready to name it. */
export function focusNameField() {
  document.getElementById(nameFieldId)?.focus();
}
