import { BackgroundSection } from "./background-section";
import { ConnectButtonSection } from "./connect-button-section";
import { DeleteButton } from "./delete-button";
import { InputFieldsSection } from "./input-fields-section";
import { LogoSection } from "./logo-section";
import { ResetButton } from "./reset-button";
import { TextSection } from "./text-section";
import type { EditorSectionProps } from "./types";

/**
 * The Editor: one section per glossary area. Each section lives in its own
 * file and owns its controls. `name` is the Open Splash Page's name.
 */
export function Editor({
  name,
  ...props
}: EditorSectionProps & { name: string }) {
  return (
    <div className="flex flex-col gap-4">
      <LogoSection {...props} />
      <BackgroundSection {...props} />
      <TextSection {...props} />
      <InputFieldsSection {...props} />
      <ConnectButtonSection {...props} />
      <div className="flex gap-2">
        <ResetButton dispatch={props.dispatch} />
        <DeleteButton name={name} dispatch={props.dispatch} />
      </div>
    </div>
  );
}
