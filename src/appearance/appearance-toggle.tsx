import { SegmentedControl } from "@/ui/segmented-control";
import type { Appearance } from "./appearance";

type AppearanceToggleProps = {
  appearance: Appearance;
  onChange: (appearance: Appearance) => void;
};

const appearanceOptions = [
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
  { value: "dark", label: "Dark" },
] as const satisfies readonly { value: Appearance; label: string }[];

/** A segmented Light / System / Dark control, exposed as a radio group. */
export function AppearanceToggle({
  appearance,
  onChange,
}: AppearanceToggleProps) {
  return (
    <SegmentedControl
      legend="Appearance"
      name="appearance"
      options={appearanceOptions}
      value={appearance}
      onChange={onChange}
    />
  );
}
