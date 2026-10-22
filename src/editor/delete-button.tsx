import { secondaryButton } from "@/ui/secondary-button";
import type { EditorSectionProps } from "./types";

/** Deletes the Open Splash Page, called `name`, once confirmed. */
export function DeleteButton({
  name,
  dispatch,
}: Pick<EditorSectionProps, "dispatch"> & { name: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (window.confirm(`Delete "${name}"? This can't be undone.`)) {
          dispatch({ type: "delete" });
        }
      }}
      className={secondaryButton}
    >
      Delete
    </button>
  );
}
