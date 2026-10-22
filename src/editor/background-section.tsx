import type { Background } from "@/splash-page";
import { EditorSection } from "./editor-section";
import { ImageUpload } from "./image-upload";
import type { EditorSectionProps } from "./types";

const backgroundKinds: { kind: Background["kind"]; label: string }[] = [
  { kind: "colour", label: "Colour" },
  { kind: "image", label: "Image" },
];

export function BackgroundSection({
  splashPage,
  dispatch,
}: EditorSectionProps) {
  return (
    <EditorSection title="Background">
      <fieldset className="flex items-center justify-between gap-3">
        <legend className="float-left text-sm font-medium">
          Background shows
        </legend>
        <div className="flex rounded-full bg-zinc-200 p-1">
          {backgroundKinds.map(({ kind, label }) => (
            <label
              key={kind}
              className="relative cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium text-zinc-700 has-[:checked]:bg-white has-[:checked]:text-zinc-900 has-[:checked]:shadow has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue-600"
            >
              <input
                type="radio"
                name="background-kind"
                value={kind}
                checked={splashPage.background.kind === kind}
                onChange={() => dispatch({ type: "setBackgroundKind", kind })}
                className="absolute inset-0 cursor-pointer appearance-none rounded-full"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="background-colour" className="text-sm font-medium">
          Background colour
        </label>
        <input
          id="background-colour"
          type="color"
          value={splashPage.background.colour}
          onChange={(event) =>
            dispatch({
              type: "setBackgroundColour",
              colour: event.target.value,
            })
          }
          className="h-9 w-14 cursor-pointer rounded-md border border-zinc-300"
        />
      </div>
      <ImageUpload
        label="Background image"
        onUpload={(imageUrl) => {
          // Release the old image's memory now it's been replaced.
          if (splashPage.background.imageUrl)
            URL.revokeObjectURL(splashPage.background.imageUrl);
          dispatch({ type: "setBackgroundImage", imageUrl });
        }}
      />
    </EditorSection>
  );
}
