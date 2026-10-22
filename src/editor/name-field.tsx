import { useState, type Dispatch } from "react";
import { splashPageName, type LibraryAction } from "@/splash-page";
import { focusRing } from "@/ui/focus-ring";

/** The id of the Name field, so focus can be moved to it. */
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
        Name
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
        className={`rounded-md border border-zinc-300 px-3 py-2 ${focusRing}`}
      />
    </div>
  );
}

/** Moves focus to the Name field, ready to name the Open Splash Page. */
export function focusNameField() {
  document.getElementById(nameFieldId)?.focus();
}
