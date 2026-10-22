import type { TextBlock } from "@/splash-page";

/** Text Blocks in the order added. Empty ones are left out to avoid gaps. */
export function PreviewTextBlocks({ textBlocks }: { textBlocks: TextBlock[] }) {
  return (
    <>
      {textBlocks
        .filter((textBlock) => textBlock.text.trim() !== "")
        .map((textBlock) => (
          <p
            key={textBlock.id}
            className="leading-tight font-bold break-words"
            style={{ color: textBlock.colour, fontSize: `${textBlock.size}px` }}
          >
            {textBlock.text}
          </p>
        ))}
    </>
  );
}
