import type { TextBlock } from "@/splash-page";
import { jumpCue } from "./jump-cue";

/**
 * Text Blocks in the order added. Empty ones are left out to avoid gaps.
 * Clicking one reports its id; they're pointer-only, with no tab stop.
 */
export function PreviewTextBlocks({
  textBlocks,
  onClick,
}: {
  textBlocks: TextBlock[];
  onClick: (textBlockId: string) => void;
}) {
  return (
    <>
      {textBlocks
        .filter((textBlock) => textBlock.text.trim() !== "")
        .map((textBlock) => (
          <p
            key={textBlock.id}
            onClick={() => onClick(textBlock.id)}
            className={`leading-tight font-bold break-words ${jumpCue}`}
            style={{ color: textBlock.colour, fontSize: `${textBlock.size}px` }}
          >
            {textBlock.text}
          </p>
        ))}
    </>
  );
}
