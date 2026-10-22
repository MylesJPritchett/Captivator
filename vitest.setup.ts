import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
  // Captivator remembers the Splash Page here; don't leak it between tests.
  localStorage.clear();
});
