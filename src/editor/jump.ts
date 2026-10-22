import type { TextBlock } from "@/splash-page";
import { textBlockControlId } from "./text-block-control-id";

/** The glossary area each Editor section controls. */
export type EditorArea =
  "logo" | "background" | "textBlocks" | "inputFields" | "connectButton";

/** The attribute that marks an Editor section with the area it controls. */
export const editorAreaAttribute = "data-editor-area";

/** Every kind of control the Editor sections use. */
const control = "input, select, button";

/**
 * Takes the Customer to the Editor section for an area: scrolls it into view
 * and focuses its first control, where Tab would land. In a radio group that
 * is the checked radio, not the first one.
 */
export function jumpToEditorArea(area: EditorArea) {
  const section = document.querySelector(`[${editorAreaAttribute}="${area}"]`);
  const first = section?.querySelector<HTMLElement>(control);
  if (!section || !first) return;
  const checkedRadio =
    first instanceof HTMLInputElement && first.type === "radio"
      ? section.querySelector<HTMLInputElement>(
          `input[type="radio"][name="${first.name}"]:checked`,
        )
      : null;
  jumpTo(section, checkedRadio ?? first);
}

/**
 * Takes the Customer to one Text Block's controls: scrolls them into view and
 * focuses that Text Block's text input.
 */
export function jumpToTextBlock(textBlockId: TextBlock["id"]) {
  const input = document.getElementById(
    textBlockControlId(textBlockId, "text"),
  );
  if (input) jumpTo(input.parentElement ?? input, input);
}

/**
 * Scrolls `target` into view, smoothly unless the Customer prefers reduced
 * motion, then moves focus to `control` without a second, instant scroll.
 * The focus ring always shows: browsers otherwise hide it after a mouse click
 * elsewhere, such as on the Device toggle, and the page may not scroll.
 */
function jumpTo(target: Element, control: HTMLElement) {
  const reduceMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  target.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
  // `focusVisible` isn't in TypeScript's DOM types yet.
  const options: FocusOptions & { focusVisible: boolean } = {
    preventScroll: true,
    focusVisible: true,
  };
  control.focus(options);
}
