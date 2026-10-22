import { SegmentedControl } from "@/ui/segmented-control";
import { devices, type Device } from "./device";

type DeviceToggleProps = {
  device: Device;
  onChange: (device: Device) => void;
};

const deviceOptions = devices.map((device) => ({
  value: device,
  label: device,
}));

/** A segmented Mobile / Desktop control, exposed as a radio group. */
export function DeviceToggle({ device, onChange }: DeviceToggleProps) {
  return (
    <SegmentedControl
      legend="Device"
      hideLegend
      name="device"
      options={deviceOptions}
      value={device}
      onChange={onChange}
    />
  );
}
