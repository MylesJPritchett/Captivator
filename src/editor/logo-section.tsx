import { EditorSection } from "./editor-section";
import { ImageUpload } from "./image-upload";
import type { EditorSectionProps } from "./types";

export function LogoSection({ dispatch }: EditorSectionProps) {
  return (
    <EditorSection title="Logo">
      <ImageUpload
        label="Logo image"
        onUpload={(imageUrl) => dispatch({ type: "setLogo", imageUrl })}
      />
    </EditorSection>
  );
}
