import type { Background } from "@/splash-page";
import { SegmentedControl } from "@/ui/segmented-control";
import { ColourControl } from "./colour-control";
import { EditorSection } from "./editor-section";
import { ImageUpload } from "./image-upload";
import type { EditorSectionProps } from "./types";

const backgroundKinds: { value: Background["kind"]; label: string }[] = [
  { value: "colour", label: "Colour" },
  { value: "image", label: "Image" },
];

export function BackgroundSection({
  splashPage,
  dispatch,
}: EditorSectionProps) {
  return (
    <EditorSection title="Background">
      <SegmentedControl
        legend="Background shows"
        name="background-kind"
        options={backgroundKinds}
        value={splashPage.background.kind}
        onChange={(kind) => dispatch({ type: "setBackgroundKind", kind })}
      />
      <ColourControl
        id="background-colour"
        label="Background colour"
        value={splashPage.background.colour}
        onChange={(colour) => dispatch({ type: "setBackgroundColour", colour })}
      />
      <ImageUpload
        label="Background image"
        imageUrl={splashPage.background.imageUrl}
        onUpload={(imageUrl) =>
          dispatch({ type: "setBackgroundImage", imageUrl })
        }
      />
    </EditorSection>
  );
}
