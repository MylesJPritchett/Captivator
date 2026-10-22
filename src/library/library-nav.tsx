import type { Dispatch } from "react";
import type { Library, LibraryAction } from "@/splash-page";
import { focusRing } from "@/ui/focus-ring";
import { secondaryButton } from "@/ui/secondary-button";

/**
 * The Library down the left side of the screen: a button to start a new
 * Splash Page, and one to open each Splash Page, in the order they were
 * created.
 */
export function LibraryNav({
  library,
  dispatch,
  onNew,
}: {
  library: Library;
  dispatch: Dispatch<LibraryAction>;
  /** Called once a new Splash Page is open. */
  onNew: () => void;
}) {
  return (
    <nav aria-label="Library" className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => {
          dispatch({ type: "new" });
          onNew();
        }}
        className={secondaryButton}
      >
        New Splash Page
      </button>
      <ul className="flex flex-col gap-1">
        {library.splashPages.map(({ id, name }) => {
          const open = id === library.openSplashPageId;
          return (
            <li key={id}>
              <button
                type="button"
                aria-current={open ? "true" : undefined}
                onClick={() => dispatch({ type: "open", id })}
                className={`w-full truncate rounded-md border-l-4 px-3 py-2 text-left text-sm hover:bg-control-hover ${
                  // The open Splash Page is bold with a bar, not only coloured.
                  open ? "border-focus font-bold" : "border-transparent"
                } ${focusRing}`}
              >
                {name}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
