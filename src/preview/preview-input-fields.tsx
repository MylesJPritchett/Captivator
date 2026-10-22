import type { InputField } from "@/splash-page";

/**
 * View-only: the Preview's Input Fields never take input or keyboard focus,
 * yet look enabled, exactly as a Guest would see them.
 */
export function PreviewInputFields({
  inputFields,
}: {
  inputFields: InputField[];
}) {
  return (
    <>
      {inputFields.map((inputField) => (
        <input
          key={inputField.type}
          type="text"
          readOnly
          tabIndex={-1}
          placeholder={inputField.type}
          aria-label={inputField.type}
          className="pointer-events-none w-full rounded-full border border-zinc-300 bg-white px-5 py-3 text-base text-zinc-900 placeholder:text-zinc-500"
        />
      ))}
    </>
  );
}
