type SegmentedControlProps<Value extends string> = {
  /** Names the radio group for assistive technology. */
  legend: string;
  /** Keep the legend for screen readers only, e.g. where the options say it all. */
  hideLegend?: boolean;
  /** The radio inputs' shared `name`; unique on the page. */
  name: string;
  options: readonly { value: Value; label: string }[];
  value: Value;
  onChange: (value: Value) => void;
};

/** A pill-shaped segmented control, exposed as a radio group with a legend. */
export function SegmentedControl<Value extends string>({
  legend,
  hideLegend = false,
  name,
  options,
  value,
  onChange,
}: SegmentedControlProps<Value>) {
  return (
    <fieldset className="flex items-center justify-between gap-3">
      <legend
        className={hideLegend ? "sr-only" : "float-left text-sm font-medium"}
      >
        {legend}
      </legend>
      <div className="flex rounded-full bg-zinc-200 p-1">
        {options.map((option) => (
          <label
            key={option.value}
            className="relative cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium text-zinc-700 has-[:checked]:bg-white has-[:checked]:text-zinc-900 has-[:checked]:shadow has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue-600"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="absolute inset-0 cursor-pointer appearance-none rounded-full outline-none"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
