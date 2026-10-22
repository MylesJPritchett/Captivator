import { useId, useState } from "react";
import type { ImageUrl } from "@/splash-page";

type ImageUploadProps = {
  /** The visible label, e.g. "Logo image" or "Background image". */
  label: string;
  /** The image currently on the Splash Page, if any. */
  imageUrl?: ImageUrl;
  /**
   * Called with an in-memory object URL (ADR-0001) once the Customer chooses
   * an image file. Never called for a file that isn't an image.
   */
  onUpload: (imageUrl: ImageUrl) => void;
  /** If given, a button with this label removes the current image. */
  remove?: { label: string; onRemove: () => void };
};

/**
 * A labelled file input that accepts image files only. Anything else shows a
 * friendly inline error and calls nothing.
 *
 * Owns the lifetime of the object URLs it creates: the current image's memory
 * is released when it's replaced or removed.
 */
export function ImageUpload({
  label,
  imageUrl,
  onUpload,
  remove,
}: ImageUploadProps) {
  const inputId = useId();
  const errorId = useId();
  const [error, setError] = useState<string>();

  const releaseCurrentImage = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  };

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
          releaseCurrentImage();
          onUpload(URL.createObjectURL(file));
        }}
        className="text-sm file:mr-3 file:rounded-md file:border file:border-zinc-300 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-zinc-100"
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      {remove && imageUrl && (
        <button
          type="button"
          onClick={() => {
            releaseCurrentImage();
            remove.onRemove();
          }}
          className="mt-2 self-start rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100"
        >
          {remove.label}
        </button>
      )}
    </div>
  );
}
