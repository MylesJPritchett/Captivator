import { ColourControl } from "./colour-control";
import { EditorSection } from "./editor-section";
import type { EditorSectionProps } from "./types";

export function ConnectButtonSection({
  splashPage,
  dispatch,
}: EditorSectionProps) {
  return (
    <EditorSection title="Connect Button">
      <ColourControl
        id="connect-button-background-colour"
        label="Connect Button background colour"
        value={splashPage.connectButton.backgroundColour}
        onChange={(colour) =>
          dispatch({ type: "setConnectButtonBackgroundColour", colour })
        }
      />
      <ColourControl
        id="connect-button-text-colour"
        label="Connect Button text colour"
        value={splashPage.connectButton.textColour}
        onChange={(colour) =>
          dispatch({ type: "setConnectButtonTextColour", colour })
        }
      />
    </EditorSection>
  );
}
