import { defineConfig, devices } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

function nixosChromium(): string | undefined {
  if (!existsSync("/etc/NIXOS")) return undefined;
  try {
    return execFileSync("which", ["chromium"], { encoding: "utf8" }).trim();
  } catch {
    return undefined;
  }
}

// Override with PLAYWRIGHT_PORT to avoid reusing another server on :3000.
const PORT = Number(process.env.PLAYWRIGHT_PORT) || 3000;
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
    // Playwright's downloaded Chromium can't run on NixOS, so use the system
    // one there. Elsewhere (including CI) the bundled browser is used.
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || nixosChromium(),
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
