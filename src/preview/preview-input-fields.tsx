import type { InputField } from "@/splash-page";
import { ClickCatcher } from "./click-catcher";

/**
 * View-only: the Preview's Input Fields never take input or keyboard focus,
 * yet look enabled, exactly as a Guest would see them. Each sits in a wrapper
 * that catches the click and jumps to the Editor.
 */
export function PreviewInputFields({
  inputFields,
  onClick,
}: {
  inputFields: InputField[];
  onClick: () => void;
}) {
  return (
    <>
      {inputFields.map((inputField) => (
        <ClickCatcher key={inputField.type} onClick={onClick}>
          <input
            type="text"
            readOnly
            tabIndex={-1}
            placeholder={inputField.type}
            aria-label={inputField.type}
            className="pointer-events-none w-full rounded-full border border-zinc-300 bg-white px-5 py-3 text-base text-zinc-900 placeholder:text-zinc-500"
          />
        </ClickCatcher>
      ))}
    </>
  );
}
