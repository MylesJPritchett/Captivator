import type { SplashPageAction } from "./reducer";
import type { SplashPage } from "./types";

export type TextBlockAction = {
  type: "updateTextBlockText";
  id: string;
  text: string;
};

export function textBlocksReducer(
  splashPage: SplashPage,
  action: SplashPageAction,
): SplashPage {
  switch (action.type) {
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
