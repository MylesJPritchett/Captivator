import { focusRing } from "@/ui/focus-ring";
import type { EditorSectionProps } from "./types";

/** Adds a copy of the Open Splash Page to the Library and opens it. */
export function DuplicateButton({
  dispatch,
}: Pick<EditorSectionProps, "dispatch">) {
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "duplicate" })}
      className={`rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100 ${focusRing}`}
    >
      Duplicate
    </button>
  );
}
