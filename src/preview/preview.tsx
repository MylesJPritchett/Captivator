import type { MouseEvent } from "react";
import type { SplashPage } from "@/splash-page";
import { backgroundStyle } from "./background-style";
import type { Device } from "./device";
import { DeviceFrame } from "./device-frame";
import { PreviewConnectButton } from "./preview-connect-button";
import { PreviewInputFields } from "./preview-input-fields";
import { PreviewLogo } from "./preview-logo";
import type { PreviewTarget } from "./preview-target";
import { PreviewTextBlocks } from "./preview-text-blocks";

type PreviewProps = {
  splashPage: SplashPage;
  device: Device;
  /** Called when the Customer clicks an element, with what they clicked. */
  onClickElement: (target: PreviewTarget) => void;
};

/**
 * Renders a Splash Page as a Guest would see it on the given Device, in the
 * fixed centred order Logo → Text Blocks → Input Fields → Connect Button.
 */
export function Preview({ splashPage, device, onClickElement }: PreviewProps) {
  // The Background, and the empty layout around the content, count as the
  // Background only when the click lands on them, not on an element on top.
  const clickBackground = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClickElement({ element: "background" });
    }
  };

  return (
    <DeviceFrame device={device}>
      {/* The Background fills the whole frame, with the content on top.
          A Guest sees the Splash Page in their own browser, so it stays in
          the light scheme whatever the Customer's. */}
      <div
        role="group"
        aria-label="Background"
        className="flex h-full w-full cursor-pointer overflow-y-auto scheme-light"
        style={backgroundStyle(splashPage.background)}
        onClick={clickBackground}
      >
        {/* The content column needs the handler too: clicks on its padding
            and the gaps between elements land on it, not on the Background. */}
        <div
          onClick={clickBackground}
          className="m-auto flex w-full max-w-[420px] flex-col items-center gap-4 px-6 py-10 text-center"
        >
          <PreviewLogo
            logo={splashPage.logo}
            onClick={() => onClickElement({ element: "logo" })}
          />
          <PreviewTextBlocks
            textBlocks={splashPage.textBlocks}
            onClick={(id) => onClickElement({ element: "textBlock", id })}
          />
          <PreviewInputFields
            inputFields={splashPage.inputFields}
            onClick={() => onClickElement({ element: "inputFields" })}
          />
          <PreviewConnectButton
            connectButton={splashPage.connectButton}
            onClick={() => onClickElement({ element: "connectButton" })}
          />
        </div>
      </div>
    </DeviceFrame>
  );
}
