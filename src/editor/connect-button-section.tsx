import type { Colour } from "@/splash-page";
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

function ColourControl({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: Colour;
  onChange: (colour: Colour) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-14 cursor-pointer rounded-md border border-zinc-300"
      />
    </div>
  );
}
