import type { TextBlock } from "@/splash-page";

/** The DOM id of one of a Text Block's controls in the Editor. */
export function textBlockControlId(
  textBlockId: TextBlock["id"],
  control: "text" | "colour" | "size",
) {
  return `text-block-${textBlockId}-${control}`;
}
