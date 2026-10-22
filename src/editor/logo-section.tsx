import { EditorSection } from "./editor-section";
import { ImageUpload } from "./image-upload";
import type { EditorSectionProps } from "./types";

export function LogoSection({ splashPage, dispatch }: EditorSectionProps) {
  return (
    <EditorSection title="Logo">
      <ImageUpload
        label="Logo image"
        imageUrl={splashPage.logo}
        onUpload={(imageUrl) => dispatch({ type: "setLogo", imageUrl })}
        remove={{
          label: "Remove Logo",
          onRemove: () => dispatch({ type: "removeLogo" }),
        }}
      />
    </EditorSection>
  );
}
