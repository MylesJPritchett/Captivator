import type { ReactNode } from "react";
import type { Device } from "./device";

type DeviceFrameProps = {
  device: Device;
  children: ReactNode;
};

/** Mobile: a phone frame around a screen of about 375×667. */
export function DeviceFrame({ children }: DeviceFrameProps) {
  return (
    <div className="w-full max-w-[399px] rounded-[2.5rem] bg-zinc-900 p-3 shadow-xl">
      <div className="aspect-[375/667] w-full overflow-hidden rounded-[1.75rem]">
        {children}
      </div>
    </div>
  );
}
