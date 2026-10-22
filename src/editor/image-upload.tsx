import { useId, useState } from "react";

export type ImageUploadProps = {
  /** The visible label, e.g. "Logo image" or "Background image". */
  label: string;
  /**
   * Called with an in-memory object URL (ADR-0001) once the Customer chooses
   * an image file. Never called for a file that isn't an image.
   */
  onUpload: (imageUrl: string) => void;
};

/**
 * A labelled file input that accepts image files only. Anything else shows a
 * friendly inline error and calls nothing.
 */
export function ImageUpload({ label, onUpload }: ImageUploadProps) {
  const inputId = useId();
  const errorId = useId();
  const [error, setError] = useState<string>();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => {
          const file = event.target.files?.[0];
          // Clear the input so choosing the same file again still counts.
          event.target.value = "";
          if (!file) return;
          if (!file.type.startsWith("image/")) {
            setError(
              `"${file.name}" isn't an image. Choose a PNG, JPG, GIF, SVG or WebP file.`,
            );
            return;
          }
          setError(undefined);
          onUpload(URL.createObjectURL(file));
        }}
        className="text-sm file:mr-3 file:rounded-md file:border file:border-zinc-300 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-zinc-100"
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
