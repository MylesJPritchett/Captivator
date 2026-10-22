import { secondaryButton } from "@/ui/secondary-button";
import type { EditorSectionProps } from "./types";

/** Adds a copy of the Open Splash Page to the Library and opens it. */
export function DuplicateButton({
  dispatch,
}: Pick<EditorSectionProps, "dispatch">) {
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "duplicate" })}
      className={secondaryButton}
    >
      Duplicate
    </button>
  );
}
