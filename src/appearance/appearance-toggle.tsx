import { SegmentedControl } from "@/ui/segmented-control";
import { appearances, type Appearance } from "./appearance";

type AppearanceToggleProps = {
  appearance: Appearance;
  onChange: (appearance: Appearance) => void;
};

const appearanceLabels: Record<Appearance, string> = {
  light: "Light",
  system: "System",
  dark: "Dark",
};

const appearanceOptions = appearances.map((appearance) => ({
  value: appearance,
  label: appearanceLabels[appearance],
}));

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
