import type { SplashPageAction } from "./reducer";
import type { SplashPage, TextBlock } from "./types";

export type TextBlockAction =
  | {
      type: "addTextBlock";
      /** Chosen by the caller so the reducer stays pure. */
      id: string;
    }
  | {
      type: "updateTextBlockText";
      id: string;
      text: string;
    };

const newTextBlock: Omit<TextBlock, "id"> = {
  text: "",
  colour: "#ffffff",
  size: 20,
};

export function textBlocksReducer(
  splashPage: SplashPage,
  action: SplashPageAction,
): SplashPage {
  switch (action.type) {
    case "addTextBlock":
      return {
        ...splashPage,
        textBlocks: [
          ...splashPage.textBlocks,
          { ...newTextBlock, id: action.id },
        ],
      };
    case "updateTextBlockText":
      return {
        ...splashPage,
        textBlocks: splashPage.textBlocks.map((textBlock) =>
          textBlock.id === action.id
            ? { ...textBlock, text: action.text }
            : textBlock,
        ),
      };
    default:
      return splashPage;
  }
}
