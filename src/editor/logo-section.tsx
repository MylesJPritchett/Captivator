import { EditorSection } from "./editor-section";
import { ImageUpload } from "./image-upload";
import type { EditorSectionProps } from "./types";

export function LogoSection({ splashPage, dispatch }: EditorSectionProps) {
  // Release the old image's memory when it's replaced or removed.
  const releaseCurrentLogo = () => {
    if (splashPage.logo) URL.revokeObjectURL(splashPage.logo);
  };

  return (
    <EditorSection title="Logo">
      <ImageUpload
        label="Logo image"
        onUpload={(imageUrl) => {
          releaseCurrentLogo();
          dispatch({ type: "setLogo", imageUrl });
        }}
      />
      {splashPage.logo && (
        <button
          type="button"
          onClick={() => {
            releaseCurrentLogo();
            dispatch({ type: "removeLogo" });
          }}
          className="self-start rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100"
        >
          Remove Logo
        </button>
      )}
    </EditorSection>
  );
}
