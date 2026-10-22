import type { Dispatch } from "react";
import type { Library, LibraryAction } from "@/splash-page";
import { focusRing } from "@/ui/focus-ring";

/**
 * The Library down the left side of the screen: a button to start a new
 * Splash Page, and one to open each Splash Page, in the order they were
 * created.
 */
export function LibraryNav({
  library,
  dispatch,
}: {
  library: Library;
  dispatch: Dispatch<LibraryAction>;
}) {
  return (
    <nav aria-label="Library" className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => dispatch({ type: "new" })}
        className={`rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100 ${focusRing}`}
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
                className={`w-full rounded-md border-l-4 px-3 py-2 text-left text-sm hover:bg-zinc-100 ${
                  // The open Splash Page is bold with a bar, not only coloured.
                  open ? "border-blue-600 font-bold" : "border-transparent"
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
