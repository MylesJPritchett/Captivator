import { EditorSection } from "./editor-section";
import { ImageUpload } from "./image-upload";
import type { EditorSectionProps } from "./types";

export function BackgroundSection({
  splashPage,
  dispatch,
}: EditorSectionProps) {
  return (
    <EditorSection title="Background">
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
