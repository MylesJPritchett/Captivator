import type { TextBlock } from "@/splash-page";

export function PreviewTextBlocks({ textBlocks }: { textBlocks: TextBlock[] }) {
  return (
    <>
      {textBlocks.map((textBlock) => (
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
