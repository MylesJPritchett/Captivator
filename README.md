# Captivator

Captivator lets a Customer mock up a branded WiFi Splash Page: the page a Guest sees when they first connect to a WiFi network. Built with Next.js and TypeScript.

Live site: <https://captivator.netlify.app/>

## What it does

- Edit the Splash Page in the Editor and see every change instantly in the Preview, on a desktop or mobile Device.
- Upload a Logo, and an image Background or a Background colour.
- Add Text Blocks and set their colour and size.
- Add up to two Input Fields, choosing from Name, Email and Phone.
- Set the Connect Button's background and text colours.
- Click an element in the Preview to jump to its section of the Editor.
- Your Splash Page is remembered in this browser, and "Reset to starter" starts again from the Starter Splash Page.
- Works in light and dark colour schemes.

Captivator runs entirely in the browser: no backend and no accounts. Your Splash Page is saved in this browser's `localStorage`, so it won't follow you to another browser or device. See [ADR-0001](docs/adr/0001-client-only-no-persistence.md) and [ADR-0003](docs/adr/0003-remember-splash-page-in-localstorage.md).

<details>
<summary>Original brief</summary>

Build an MVP of Captivator using Next.js, with up to 4 hours of development time (paid - $100 per hour). The app should let customers visually mock up a branded WiFi splash page using a simple WYSIWYG editor.

Customers should (at a minimum) be able to:

- Upload a logo or image.
- Upload a background image or choose a custom background colour.
- Add text and adjust its colour and size.
- Add up to two Input Fields, choosing from Name, Email and Phone.
- Customise the Connect Button’s background colour and text colour.

Show changes instantly in a live preview, with mobile and desktop views. Keep the editor intuitive for non-technical customers.

</details>

## Getting started

Requires Node 24 (see `.nvmrc`) and pnpm (the version is pinned in `package.json`).

```sh
pnpm install
pnpm dev          # http://localhost:3000
```

## Testing

```sh
pnpm test            # Vitest unit + component tests
pnpm test:watch      # Vitest in watch mode
pnpm test:coverage   # Vitest with coverage (reported, not enforced)
pnpm test:e2e        # Playwright E2E, desktop + mobile; builds first
```

Other checks: `pnpm lint`, `pnpm typecheck`, `pnpm format:check` (`pnpm format` to fix).

Before running E2E for the first time, install the browser with `pnpm exec playwright install chromium`. On NixOS, Playwright uses the system `chromium` automatically; set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to use a different one.

`pnpm test:e2e` reuses any server already listening on its port, including `pnpm dev`. To test a fresh production build instead, set `PLAYWRIGHT_PORT` (default 3000) to a free port, e.g. `PLAYWRIGHT_PORT=3100 pnpm test:e2e`.

For the testing strategy and seams, see [Testing & TDD in CLAUDE.md](CLAUDE.md#testing--tdd).

CI (GitHub Actions) runs format check, lint, typecheck, Vitest and Playwright on every push and pull request.

## Deploying

The site is hosted on Netlify at <https://captivator.netlify.app/>. Every push to `main` deploys it automatically, and every pull request gets a Deploy Preview at `https://deploy-preview-<PR number>--captivator.netlify.app`, linked in a comment from Netlify on the PR.

`netlify.toml` sets the build command and Node 24, and Netlify's Next.js runtime does the rest. To deploy a copy of your own, connect the repo to a new site in the Netlify UI.

## Docs

- `GLOSSARY.md`: domain vocabulary
- `docs/adr/`: architecture decisions
- `CLAUDE.md`: instructions for working on the repo with Claude, including the TDD workflow
