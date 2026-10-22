import { buttonClass } from "@/ui/controls";
import type { EditorSectionProps } from "./types";

/** Returns the Splash Page to the Starter Splash Page once confirmed. */
export function ResetButton({
  dispatch,
}: Pick<EditorSectionProps, "dispatch">) {
  return (
    <button
      type="button"
      onClick={() => {
        if (
          window.confirm(
            "Reset to the starter Splash Page? Your changes will be lost.",
          )
        ) {
          dispatch({ type: "reset" });
        }
      }}
      className={`self-start px-3 py-2 text-sm font-medium ${buttonClass}`}
    >
      Reset to starter
    </button>
  );
}
