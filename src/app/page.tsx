"use client";

import { useEffect, useReducer, useState } from "react";
import { Editor } from "@/editor";
import { defaultDevice, DeviceToggle, Preview, type Device } from "@/preview";
import {
  loadSplashPage,
  saveSplashPage,
  splashPageReducer,
  type SaveResult,
  type SplashPage,
} from "@/splash-page";

export default function Home() {
  // The remembered Splash Page lives in this browser's localStorage, which
  // only exists after mount (the route is prerendered). Until it's read,
  // render nothing rather than flash the Starter Splash Page.
  const [initialSplashPage, setInitialSplashPage] = useState<SplashPage>();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only storage once after mount
    setInitialSplashPage(loadSplashPage(localStorage));
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:flex-row lg:items-start lg:gap-10 lg:p-8">
      {initialSplashPage && (
        <Captivator initialSplashPage={initialSplashPage} />
      )}
    </main>
  );
}

function Captivator({ initialSplashPage }: { initialSplashPage: SplashPage }) {
  const [splashPage, dispatch] = useReducer(
    splashPageReducer,
    initialSplashPage,
  );
  const [device, setDevice] = useState<Device>(defaultDevice);

  const [saveResult, setSaveResult] = useState<SaveResult>("saved");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reporting how much of the Splash Page browser-only storage could hold
    setSaveResult(saveSplashPage(localStorage, splashPage));
  }, [splashPage]);

  return (
    <>
      <section
        aria-labelledby="preview-heading"
        className="flex flex-col items-center gap-4 lg:sticky lg:top-8 lg:flex-1"
      >
        <h2 id="preview-heading" className="sr-only">
          Preview
        </h2>
        <DeviceToggle device={device} onChange={setDevice} />
        <Preview splashPage={splashPage} device={device} />
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
