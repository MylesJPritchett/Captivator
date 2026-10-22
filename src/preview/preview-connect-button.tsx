import type { ConnectButton } from "@/splash-page";
import { jumpCue } from "./jump-cue";

/**
 * View-only: the Preview's Connect Button does nothing and takes no keyboard
 * focus, yet looks enabled, exactly as a Guest would see it. A wrapper catches
 * the click and jumps to the Editor; it's pointer-only, with no tab stop.
 */
export function PreviewConnectButton({
  connectButton,
  onClick,
}: {
  connectButton: ConnectButton;
  onClick: () => void;
}) {
  return (
    <div onClick={onClick} className={`w-full rounded-full ${jumpCue}`}>
      <button
        type="button"
        tabIndex={-1}
        className="pointer-events-none w-full rounded-full px-5 py-3 text-base font-semibold"
        style={{
          backgroundColor: connectButton.backgroundColour,
          color: connectButton.textColour,
        }}
      >
        Connect
      </button>
    </div>
  );
}
