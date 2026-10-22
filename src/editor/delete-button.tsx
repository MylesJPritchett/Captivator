import { focusRing } from "@/ui/focus-ring";
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
      className={`rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100 ${focusRing}`}
    >
      Delete
    </button>
  );
}
