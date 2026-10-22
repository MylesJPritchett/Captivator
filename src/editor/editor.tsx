import type { Dispatch } from "react";
import type { LibraryAction, LibraryEntry } from "@/splash-page";
import { BackgroundSection } from "./background-section";
import { ConnectButtonSection } from "./connect-button-section";
import { DeleteButton } from "./delete-button";
import { DuplicateButton } from "./duplicate-button";
import { InputFieldsSection } from "./input-fields-section";
import { LogoSection } from "./logo-section";
import { NameField } from "./name-field";
import { ResetButton } from "./reset-button";
import { TextSection } from "./text-section";

/**
 * The Editor: the Open Splash Page's name, then one section per glossary
 * area. Each section lives in its own file and owns its controls.
 */
export function Editor({
  open,
  dispatch,
}: {
  /** The Open Splash Page's Library entry. */
  open: LibraryEntry;
  dispatch: Dispatch<LibraryAction>;
}) {
  const props = { splashPage: open.splashPage, dispatch };
  return (
    <div className="flex flex-col gap-4">
      <NameField splashPageId={open.id} name={open.name} dispatch={dispatch} />
      <LogoSection {...props} />
      <BackgroundSection {...props} />
      <TextSection {...props} />
      <InputFieldsSection {...props} />
      <ConnectButtonSection {...props} />
      <div className="flex flex-wrap gap-2">
        <ResetButton dispatch={dispatch} />
        <DuplicateButton dispatch={dispatch} />
        <DeleteButton name={open.name} dispatch={dispatch} />
      </div>
    </div>
  );
}
