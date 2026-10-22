import { secondaryButton } from "@/ui/secondary-button";
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
      className={`self-start ${secondaryButton}`}
    >
      Reset to starter
    </button>
  );
}
