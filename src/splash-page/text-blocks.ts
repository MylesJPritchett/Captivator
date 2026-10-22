import type { SplashPageAction } from "./reducer";
import type { Colour, SplashPage, TextBlock } from "./types";

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
    }
  | {
      type: "updateTextBlockColour";
      id: string;
      colour: Colour;
    }
  | {
      type: "removeTextBlock";
      id: string;
    };

const newTextBlock: Omit<TextBlock, "id"> = {
  text: "New text",
  colour: "#ffffff",
  size: 20,
};

function updateTextBlock(
  splashPage: SplashPage,
  id: string,
  changes: Partial<Omit<TextBlock, "id">>,
): SplashPage {
  return {
    ...splashPage,
    textBlocks: splashPage.textBlocks.map((textBlock) =>
      textBlock.id === id ? { ...textBlock, ...changes } : textBlock,
    ),
  };
}

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
      return updateTextBlock(splashPage, action.id, { text: action.text });
    case "updateTextBlockColour":
      return updateTextBlock(splashPage, action.id, { colour: action.colour });
    case "removeTextBlock":
      return {
        ...splashPage,
        textBlocks: splashPage.textBlocks.filter(
          (textBlock) => textBlock.id !== action.id,
        ),
      };
    default:
      return splashPage;
  }
}
