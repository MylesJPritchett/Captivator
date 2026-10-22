"use client";

import { useReducer, useState } from "react";
import { Editor } from "@/editor";
import { defaultDevice, Preview, type Device } from "@/preview";
import { splashPageReducer, starterSplashPage } from "@/splash-page";

export default function Home() {
  const [splashPage, dispatch] = useReducer(
    splashPageReducer,
    starterSplashPage,
  );
  const [device] = useState<Device>(defaultDevice);

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:flex-row lg:items-start lg:gap-10 lg:p-8">
      <section
        aria-labelledby="preview-heading"
        className="flex flex-col items-center gap-4 lg:sticky lg:top-8 lg:flex-1"
      >
        <h2 id="preview-heading" className="sr-only">
          Preview
        </h2>
        <Preview splashPage={splashPage} device={device} />
      </section>

      <section
        aria-labelledby="editor-heading"
        className="flex w-full flex-col gap-4 lg:max-w-md"
      >
        <h2 id="editor-heading" className="text-2xl font-bold">
          Editor
        </h2>
        <p className="text-sm text-zinc-600">
          Your design is not saved. Refreshing the page starts again from the
          starter Splash Page.
        </p>
        <Editor splashPage={splashPage} dispatch={dispatch} />
      </section>
    </main>
  );
}
