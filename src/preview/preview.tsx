import type { MouseEvent } from "react";
import type { EditorArea } from "@/editor";
import type { SplashPage } from "@/splash-page";
import { backgroundStyle } from "./background-style";
import type { Device } from "./device";
import { DeviceFrame } from "./device-frame";
import { PreviewConnectButton } from "./preview-connect-button";
import { PreviewInputFields } from "./preview-input-fields";
import { PreviewLogo } from "./preview-logo";
import { PreviewTextBlocks } from "./preview-text-blocks";

type PreviewProps = {
  splashPage: SplashPage;
  device: Device;
  /** Called when the Customer clicks an element, with the area it shows. */
  onJump: (area: EditorArea) => void;
};

/**
 * Renders a Splash Page as a Guest would see it on the given Device, in the
 * fixed centred order Logo → Text Blocks → Input Fields → Connect Button.
 */
export function Preview({ splashPage, device, onJump }: PreviewProps) {
  // The Background, and the empty layout around the content, jump to the
  // Background only when the click lands on them, not on an element on top.
  const jumpToBackground = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onJump("background");
  };

  return (
    <DeviceFrame device={device}>
      {/* The Background fills the whole frame, with the content on top. */}
      <div
        role="group"
        aria-label="Background"
        className="flex h-full w-full cursor-pointer overflow-y-auto"
        style={backgroundStyle(splashPage.background)}
        onClick={jumpToBackground}
      >
        <div
          onClick={jumpToBackground}
          className="m-auto flex w-full max-w-[420px] flex-col items-center gap-4 px-6 py-10 text-center"
        >
          <PreviewLogo logo={splashPage.logo} onClick={() => onJump("logo")} />
          <PreviewTextBlocks textBlocks={splashPage.textBlocks} />
          <PreviewInputFields inputFields={splashPage.inputFields} />
          <PreviewConnectButton connectButton={splashPage.connectButton} />
        </div>
      </div>
    </DeviceFrame>
  );
}
