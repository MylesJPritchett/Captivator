import type { ReactNode } from "react";
import { jumpCue } from "./jump-cue";

/**
 * Wraps an inert, view-only Preview control (one with `pointer-events-none`
 * and `tabIndex={-1}`) so the Customer can still click it. Pointer-only, with
 * no tab stop.
 */
export function ClickCatcher({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <div onClick={onClick} className={`w-full rounded-full ${jumpCue}`}>
      {children}
    </div>
  );
}
