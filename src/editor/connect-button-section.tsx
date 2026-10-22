import { EditorSection } from "./editor-section";
import type { EditorSectionProps } from "./types";

export function ConnectButtonSection({
  splashPage,
  dispatch,
}: EditorSectionProps) {
  return (
    <EditorSection title="Connect Button">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor="connect-button-background-colour"
          className="text-sm font-medium"
        >
          Connect Button background colour
        </label>
        <input
          id="connect-button-background-colour"
          type="color"
          value={splashPage.connectButton.backgroundColour}
          onChange={(event) =>
            dispatch({
              type: "setConnectButtonBackgroundColour",
              colour: event.target.value,
            })
          }
          className="h-9 w-14 cursor-pointer rounded-md border border-zinc-300"
        />
      </div>
    </EditorSection>
  );
}
