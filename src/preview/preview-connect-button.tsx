import type { ConnectButton } from "@/splash-page";

/**
 * View-only: the Preview's Connect Button does nothing and takes no keyboard
 * focus, yet looks enabled, exactly as a Guest would see it.
 */
export function PreviewConnectButton({
  connectButton,
}: {
  connectButton: ConnectButton;
}) {
  return (
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
  );
}
