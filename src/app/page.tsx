"use client";

import { useReducer, useState } from "react";
import { defaultDevice, Preview, type Device } from "@/preview";
import { splashPageReducer, starterSplashPage } from "@/splash-page";

export default function Home() {
  const [splashPage] = useReducer(splashPageReducer, starterSplashPage);
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
    </main>
  );
}
