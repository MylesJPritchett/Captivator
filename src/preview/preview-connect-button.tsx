import type { ConnectButton } from "@/splash-page";

/** View-only: the Preview's Connect Button never does anything. */
export function PreviewConnectButton({
  connectButton,
}: {
  connectButton: ConnectButton;
}) {
  return (
    <button
      type="button"
      disabled
      className="w-full rounded-full px-5 py-3 text-base font-semibold uppercase"
      style={{
        backgroundColor: connectButton.backgroundColour,
        color: connectButton.textColour,
      }}
    >
      Connect
    </button>
  );
}
