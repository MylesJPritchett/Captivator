import "fake-indexeddb/auto";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { clear } from "idb-keyval";
import { afterEach } from "vitest";

// jsdom has no scrollIntoView, which click-to-jump calls; make it a no-op.
Element.prototype.scrollIntoView ??= () => {};

afterEach(async () => {
  cleanup();
  // Captivator remembers the Library in IndexedDB, and ADR-0003 remembered
  // the Splash Page in localStorage; don't leak either between tests.
  await clear();
  localStorage.clear();
});
