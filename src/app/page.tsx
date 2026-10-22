"use client";

import { useEffect, useId, useReducer, useState } from "react";
import {
  Editor,
  focusNameField,
  jumpToEditorArea,
  jumpToTextBlock,
} from "@/editor";
import {
  defaultDevice,
  DeviceToggle,
  Preview,
  type Device,
  type PreviewTarget,
} from "@/preview";
import { LibraryNav } from "@/library";
import { secondaryButton } from "@/ui/secondary-button";
import {
  libraryReducer,
  loadLibrary,
  openEntry,
  saveLibrary,
  type Library,
  type SaveResult,
} from "@/splash-page";

export default function Home() {
  // The remembered Library lives in this browser's IndexedDB, which only
  // exists after mount (the route is prerendered) and is read asynchronously.
  // Until it's loaded, render nothing rather than flash the Starter Splash
  // Page.
  const [initialLibrary, setInitialLibrary] = useState<Library>();
  useEffect(() => {
    let mounted = true;
    void loadLibrary(localStorage).then((library) => {
      if (mounted) setInitialLibrary(library);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:flex-row lg:items-start lg:gap-10 lg:p-8">
      {initialLibrary && <Captivator initialLibrary={initialLibrary} />}
    </main>
  );
}

function Captivator({ initialLibrary }: { initialLibrary: Library }) {
  const [library, dispatch] = useReducer(libraryReducer, initialLibrary);
  const open = openEntry(library);
  const [device, setDevice] = useState<Device>(defaultDevice);
  // Narrow screens hide the Library behind a button; wide ones always show it.
  const [libraryShown, setLibraryShown] = useState(false);
  const libraryId = useId();

  const [saveResult, setSaveResult] = useState<SaveResult>("saved");
  useEffect(() => {
    // Saves go through in order; report only the latest one's result.
    let latest = true;
    void saveLibrary(library).then((result) => {
      if (latest) setSaveResult(result);
    });
    return () => {
      latest = false;
    };
  }, [library]);

  return (
    <>
      <div className="flex w-full flex-col gap-3 lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:w-56 lg:shrink-0 lg:overflow-y-auto">
        <button
          type="button"
          aria-expanded={libraryShown}
          aria-controls={libraryId}
          onClick={() => setLibraryShown((shown) => !shown)}
          className={`self-start lg:hidden ${secondaryButton}`}
        >
          Library
        </button>
        <div id={libraryId} className={libraryShown ? "" : "hidden lg:block"}>
          <LibraryNav
            library={library}
            dispatch={(action) => {
              dispatch(action);
              // Opening a Splash Page takes the narrow-screen Library away.
              setLibraryShown(false);
            }}
            onNew={focusNameField}
          />
        </div>
      </div>

      <section
        aria-labelledby="preview-heading"
        className="flex flex-col items-center gap-4 lg:sticky lg:top-8 lg:flex-1"
      >
        <h2 id="preview-heading" className="sr-only">
          Preview
        </h2>
        <DeviceToggle device={device} onChange={setDevice} />
        <Preview
          splashPage={open.splashPage}
          device={device}
          onClickElement={jumpToEditorFor}
        />
      </section>

      <section
        aria-labelledby="editor-heading"
        className="flex w-full flex-col gap-4 lg:max-w-md"
      >
        <h2 id="editor-heading" className="text-2xl font-bold">
          Editor
        </h2>
        <div role="status" className="flex flex-col gap-1 text-sm">
          {saveResult === "not saved" ? (
            <p className="text-amber-800">
              Your design can&apos;t be saved in this browser, so it will be
              lost when you leave.
            </p>
          ) : (
            <p className="text-zinc-600">
              Your Splash Pages are saved in this browser.
            </p>
          )}
          {saveResult === "saved without images" && (
            <p className="text-amber-800">
              Your images are too large to remember in this browser; text and
              colours are still saved.
            </p>
          )}
        </div>
        <Editor open={open} dispatch={dispatch} />
      </section>
    </>
  );
}

/** Takes the Customer to the Editor controls for what they clicked in the Preview. */
function jumpToEditorFor(target: PreviewTarget) {
  if (target.element === "textBlock") jumpToTextBlock(target.id);
  else jumpToEditorArea(target.element);
}
