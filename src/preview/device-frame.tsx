"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { Device } from "./device";

type DeviceFrameProps = {
  device: Device;
  children: ReactNode;
};

/** Shows the Preview's content inside the frame for the chosen Device. */
export function DeviceFrame({ device, children }: DeviceFrameProps) {
  return device === "Desktop" ? (
    <DesktopFrame>{children}</DesktopFrame>
  ) : (
    <MobileFrame>{children}</MobileFrame>
  );
}

/** Mobile: a phone frame around a screen of about 375×667. */
function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div
      role="figure"
      aria-label="Mobile Preview"
      className="w-full max-w-[399px] rounded-[2.5rem] bg-zinc-900 p-3 shadow-xl"
    >
      <div className="aspect-[375/667] w-full overflow-hidden rounded-[1.75rem]">
        {children}
      </div>
    </div>
  );
}

const desktopScreen = { width: 1280, height: 800 };

/**
 * Desktop: a laptop-sized screen (1280×800) scaled down to fit the space
 * available, so the Splash Page keeps its real proportions.
 */
function DesktopFrame({ children }: { children: ReactNode }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const screen = screenRef.current;
    if (!screen || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / desktopScreen.width),
    );
    observer.observe(screen);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      role="figure"
      aria-label="Desktop Preview"
      className="w-full max-w-[960px] rounded-xl bg-zinc-900 p-2 shadow-xl"
    >
      <div
        ref={screenRef}
        className="relative aspect-[1280/800] w-full overflow-hidden rounded-md"
      >
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{
            width: desktopScreen.width,
            height: desktopScreen.height,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
