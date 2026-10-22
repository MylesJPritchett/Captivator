import { maxTextBlockSize, minTextBlockSize } from "@/splash-page";
import { EditorSection } from "./editor-section";
import type { EditorSectionProps } from "./types";

export function TextSection({ splashPage, dispatch }: EditorSectionProps) {
  return (
    <EditorSection title="Text">
      {splashPage.textBlocks.map((textBlock, index) => {
        const name = `Text Block ${index + 1}`;
        const idPrefix = `text-block-${textBlock.id}`;
        return (
          <div
            key={textBlock.id}
            className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-3"
          >
            <label htmlFor={`${idPrefix}-text`} className="text-sm font-medium">
              {name} text
            </label>
            <input
              id={`${idPrefix}-text`}
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
            <div className="flex items-center gap-2">
              <label
                htmlFor={`${idPrefix}-colour`}
                className="text-sm font-medium"
              >
                {name} colour
              </label>
              <input
                id={`${idPrefix}-colour`}
                type="color"
                value={textBlock.colour}
                onChange={(event) =>
                  dispatch({
                    type: "updateTextBlockColour",
                    id: textBlock.id,
                    colour: event.target.value,
                  })
                }
                className="h-8 w-12 cursor-pointer rounded border border-zinc-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor={`${idPrefix}-size`}
                className="text-sm font-medium"
              >
                {name} size
              </label>
              <input
                id={`${idPrefix}-size`}
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
                className="flex-1"
              />
              <output
                htmlFor={`${idPrefix}-size`}
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
              className="self-start rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-50"
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
        className="self-start rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-50"
      >
        Add Text Block
      </button>
    </EditorSection>
  );
}
