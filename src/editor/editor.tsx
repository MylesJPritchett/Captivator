import { BackgroundSection } from "./background-section";
import { ConnectButtonSection } from "./connect-button-section";
import { InputFieldsSection } from "./input-fields-section";
import { LogoSection } from "./logo-section";
import { ResetButton } from "./reset-button";
import { TextSection } from "./text-section";
import type { EditorSectionProps } from "./types";

/**
 * The Editor: one section per glossary area. Each section lives in its own
 * file and owns its controls.
 */
export function Editor(props: EditorSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <LogoSection {...props} />
      <BackgroundSection {...props} />
      <TextSection {...props} />
      <InputFieldsSection {...props} />
      <ConnectButtonSection {...props} />
      <ResetButton dispatch={props.dispatch} />
    </div>
  );
}
