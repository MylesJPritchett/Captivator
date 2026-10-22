import type { ReactNode } from "react";

/** A labelled group of Editor controls for one glossary area. */
export function EditorSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4">
      <legend className="px-1 text-base font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}
