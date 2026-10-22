import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom has no scrollIntoView, which click-to-jump calls; make it a no-op.
Element.prototype.scrollIntoView ??= () => {};

afterEach(() => {
  cleanup();
});
