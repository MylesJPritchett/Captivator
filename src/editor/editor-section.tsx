import type { ReactNode } from "react";
import { editorAreaAttribute, type EditorArea } from "./jump";

/**
 * A labelled group of Editor controls for one glossary area, marked with
 * that area so a click in the Preview can jump to it.
 */
export function EditorSection({
  title,
  area,
  children,
}: {
  title: string;
  area: EditorArea;
  children: ReactNode;
}) {
  return (
    <fieldset
      {...{ [editorAreaAttribute]: area }}
      className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4"
    >
      <legend className="px-1 text-base font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}
