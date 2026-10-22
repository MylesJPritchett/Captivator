import type { Colour } from "@/splash-page";
import { focusRing } from "@/ui/focus-ring";

/** A labelled native colour picker. */
export function ColourControl({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: Colour;
  onChange: (colour: Colour) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-9 w-14 cursor-pointer rounded-md border border-zinc-300 ${focusRing}`}
      />
    </div>
  );
}
