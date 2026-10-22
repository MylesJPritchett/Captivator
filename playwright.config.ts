import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  // Only browser tests live here; colocated *.test.ts(x) files belong to Vitest.
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    // Optional: point at a system Chromium where Playwright's download can't
    // run (e.g. NixOS). Unset in CI, so the bundled browser is used there.
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
    },
  },
  // Chromium only, at both Device sizes the Preview supports.
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
  // Run against production output, not the dev server.
  webServer: {
    command: `pnpm build && pnpm start --port ${PORT}`,
    url: baseURL,
    // Locally, reuses any server already on :3000, even `pnpm dev`.
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
