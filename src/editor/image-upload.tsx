import { useId } from "react";

type ImageUploadProps = {
  /** The visible label, e.g. "Logo image". */
  label: string;
  /** Called with an in-memory object URL for the chosen image. */
  onUpload: (imageUrl: string) => void;
};

/** A labelled file input that accepts image files only. */
export function ImageUpload({ label, onUpload }: ImageUploadProps) {
  const inputId = useId();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onUpload(URL.createObjectURL(file));
        }}
      />
    </div>
  );
}
