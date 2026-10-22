import { EditorSection } from "./editor-section";
import type { EditorSectionProps } from "./types";

export function TextSection({ splashPage, dispatch }: EditorSectionProps) {
  return (
    <EditorSection title="Text">
      {splashPage.textBlocks.map((textBlock, index) => {
        const inputId = `text-block-${textBlock.id}-text`;
        return (
          <div key={textBlock.id} className="flex flex-col gap-1">
            <label htmlFor={inputId} className="text-sm font-medium">
              Text Block {index + 1} text
            </label>
            <input
              id={inputId}
              type="text"
              value={textBlock.text}
              onChange={(event) =>
                dispatch({
                  type: "updateTextBlockText",
                  id: textBlock.id,
                  text: event.target.value,
                })
              }
              className="rounded-md border border-zinc-300 px-3 py-2"
            />
          </div>
        );
      })}
    </EditorSection>
  );
}
