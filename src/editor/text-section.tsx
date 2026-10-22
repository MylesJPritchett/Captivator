import { maxTextBlockSize, minTextBlockSize } from "@/splash-page";
import { focusRing } from "@/ui/focus-ring";
import { ColourControl } from "./colour-control";
import { fieldClass, outlinedButtonClass } from "./controls";
import { EditorSection } from "./editor-section";
import { textBlockControlId } from "./text-block-control-id";
import type { EditorSectionProps } from "./types";

export function TextSection({ splashPage, dispatch }: EditorSectionProps) {
  return (
    <EditorSection title="Text" area="textBlocks">
      {splashPage.textBlocks.map((textBlock, index) => {
        const name = `Text Block ${index + 1}`;
        const textId = textBlockControlId(textBlock.id, "text");
        const sizeId = textBlockControlId(textBlock.id, "size");
        return (
          <div
            key={textBlock.id}
            className="flex flex-col gap-2 rounded-lg border border-divider p-3"
          >
            <label htmlFor={textId} className="text-sm font-medium">
              {name} text
            </label>
            <input
              id={textId}
              type="text"
              value={textBlock.text}
              onChange={(event) =>
                dispatch({
                  type: "updateTextBlockText",
                  id: textBlock.id,
                  text: event.target.value,
                })
              }
              className={`px-3 py-2 ${fieldClass}`}
            />
            <ColourControl
              id={textBlockControlId(textBlock.id, "colour")}
              label={`${name} colour`}
              value={textBlock.colour}
              onChange={(colour) =>
                dispatch({
                  type: "updateTextBlockColour",
                  id: textBlock.id,
                  colour,
                })
              }
            />
            <div className="flex items-center gap-2">
              <label htmlFor={sizeId} className="text-sm font-medium">
                {name} size
              </label>
              <input
                id={sizeId}
                type="range"
                min={minTextBlockSize}
                max={maxTextBlockSize}
                step={1}
                value={textBlock.size}
                onChange={(event) =>
                  dispatch({
                    type: "updateTextBlockSize",
                    id: textBlock.id,
                    size: Number(event.target.value),
                  })
                }
                className={`flex-1 accent-primary ${focusRing}`}
              />
              <output
                htmlFor={sizeId}
                className="w-12 text-right text-sm tabular-nums"
              >
                {textBlock.size}px
              </output>
            </div>
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "removeTextBlock", id: textBlock.id })
              }
              className={`self-start px-3 py-1 text-sm ${outlinedButtonClass}`}
            >
              Remove {name}
            </button>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() =>
          dispatch({ type: "addTextBlock", id: crypto.randomUUID() })
        }
        className={`self-start px-3 py-2 text-sm font-medium ${outlinedButtonClass}`}
      >
        Add Text Block
      </button>
    </EditorSection>
  );
}
