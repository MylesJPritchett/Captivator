"use client";

import { useEffect, useReducer, useState } from "react";
import { Editor, jumpToEditorArea, jumpToTextBlock } from "@/editor";
import {
  defaultDevice,
  DeviceToggle,
  Preview,
  type Device,
  type PreviewTarget,
} from "@/preview";
import { LibraryNav } from "@/library";
import {
  libraryReducer,
  loadLibrary,
  openSplashPage,
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
  const splashPage = openSplashPage(library);
  const [device, setDevice] = useState<Device>(defaultDevice);

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
      <div className="w-full lg:sticky lg:top-8 lg:w-56 lg:shrink-0">
        <LibraryNav library={library} dispatch={dispatch} />
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
          splashPage={splashPage}
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
              Your design is saved in this browser.
            </p>
          )}
          {saveResult === "saved without images" && (
            <p className="text-amber-800">
              Your images are too large to remember in this browser; text and
              colours are still saved.
            </p>
          )}
        </div>
        <Editor splashPage={splashPage} dispatch={dispatch} />
      </section>
    </>
  );
}

/** Takes the Customer to the Editor controls for what they clicked in the Preview. */
function jumpToEditorFor(target: PreviewTarget) {
  if (target.element === "textBlock") jumpToTextBlock(target.id);
  else jumpToEditorArea(target.element);
}
