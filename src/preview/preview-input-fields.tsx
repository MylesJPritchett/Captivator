import type { InputField } from "@/splash-page";

/** View-only: the Preview's Input Fields never take input. */
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
          disabled
          placeholder={inputField.type}
          aria-label={inputField.type}
          className="w-full rounded-full border border-zinc-300 bg-white px-5 py-3 text-base text-zinc-900 placeholder:text-zinc-500"
        />
      ))}
    </>
  );
}
