import { devices, type Device } from "./device";

type DeviceToggleProps = {
  device: Device;
  onChange: (device: Device) => void;
};

/** A segmented Mobile / Desktop control, exposed as a radio group. */
export function DeviceToggle({ device, onChange }: DeviceToggleProps) {
  return (
    <fieldset className="flex rounded-full bg-zinc-200 p-1">
      <legend className="sr-only">Device</legend>
      {devices.map((option) => (
        <label
          key={option}
          className="cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium text-zinc-700 has-[:checked]:bg-white has-[:checked]:text-zinc-900 has-[:checked]:shadow has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue-600"
        >
          <input
            type="radio"
            name="device"
            value={option}
            checked={device === option}
            onChange={() => onChange(option)}
            className="sr-only"
          />
          {option}
        </label>
      ))}
    </fieldset>
  );
}
