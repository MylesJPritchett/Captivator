This is a captivator project that people see when they first connect to a WiFi connection.

The requirements are:

Captivator MVP

Build an MVP of Captivator using Next.js, with up to 4 hours of development time (paid - $100 per hour). The app should let customers visually mock up a branded WiFi splash page using a simple WYSIWYG editor.

Customers should (at a minimum) be able to:

    Upload a logo or image.
    Upload a background image or choose a custom background colour.
    Add text and adjust its colour and size.
    Add up to two Input Fields, choosing from Name, Email and Phone.
    Customise the Connect Button’s background colour and text colour.

Show changes instantly in a live preview, with mobile and desktop views. Keep the editor intuitive for non-technical customers.

It is built in Next.js using typescript.

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

Other checks: `pnpm lint`, `pnpm typecheck`, `pnpm format:check` (`pnpm format` to fix). Before running E2E for the first time, install the browser with `pnpm exec playwright install chromium`. On NixOS, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to a system Chromium instead.

For the testing strategy and seams, see [Testing & TDD in CLAUDE.md](CLAUDE.md#testing--tdd).

CI (GitHub Actions) runs format check, lint, typecheck, Vitest and Playwright on every push and pull request.

## Deploying

The site deploys to Netlify. `netlify.toml` sets the build command and Node 24, and Netlify's Next.js runtime does the rest: connect the repo in the Netlify UI and deploy.

## Docs

- `GLOSSARY.md`: domain vocabulary
- `docs/adr/`: architecture decisions
- `CLAUDE.md`: instructions for working on the repo with Claude, including the TDD workflow
