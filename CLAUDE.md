## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) for every commit message: `<type>(<optional scope>): <description>`, e.g. `feat(editor): add background colour picker` or `fix: keep preview in sync on resize`. Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`.

## Next.js

This is Next.js 16 with the App Router. Read `AGENTS.md` before writing Next.js code; APIs may differ from what you expect.

## Testing & TDD

### Commands

| Command              | What it does                                         |
| -------------------- | ---------------------------------------------------- |
| `pnpm dev`           | Start the dev server                                 |
| `pnpm build`         | Production build                                     |
| `pnpm start`         | Serve the production build                           |
| `pnpm lint`          | ESLint                                               |
| `pnpm typecheck`     | Generate Next route types, then `tsc --noEmit`       |
| `pnpm format`        | Prettier, write                                      |
| `pnpm format:check`  | Prettier, check only (CI runs this)                  |
| `pnpm test`          | Vitest unit + component suite, once                  |
| `pnpm test:watch`    | Vitest in watch mode; use this during red-green      |
| `pnpm test:coverage` | Vitest with v8 coverage (reported, never enforced)   |
| `pnpm test:e2e`      | Playwright, Chromium, desktop + mobile; builds first |

Locally, `pnpm test:e2e` reuses any server already listening on :3000, including `pnpm dev`. Stop it first if you need to test the production build.

Before saying work is done, run `format:check`, `lint`, `typecheck` and `test`. Run `test:e2e` when you touch browser behaviour. On NixOS the downloaded Chromium can't run; set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to a system Chromium.

### Red-green-refactor

- Never write production code without a failing test that needs it. Write one test, watch it fail for the right reason, write the least code to pass, repeat.
- One vertical slice at a time: one test, one implementation. Don't write a batch of tests up front.
- Refactor only when green, and keep the tests green while you do.

### Seams

Test only at these three seams. Don't add others without agreeing it with the developer.

1. **The Splash Page reducer** (Vitest, pure functions). Domain rules live and are tested here, e.g. "at most two Input Fields, never two of the same type". Assert on the returned Splash Page given a starting Splash Page and an action.
2. **The Editor and Preview rendered together** (React Testing Library in jsdom). This is the primary seam: a Customer changes something in the Editor and the Preview shows it. No isolated tests per Editor control.
3. **A real browser** (Playwright, `e2e/`). Only a few happy paths that jsdom fakes poorly: the Device toggle, real layout, file upload.

### Writing tests

- Test behaviour through public interfaces, never implementation details. Don't assert on internal state, hook calls or class names.
- Query by role or label (`getByRole`, `getByLabelText`); act with `@testing-library/user-event`. Fall back to text only when no role or label fits.
- Use `GLOSSARY.md` terms in test names and code: Splash Page, Logo, Background, Text Block, Input Field, Connect Button, Editor, Preview, Device, Customer, Guest. Avoid the listed aliases.
- Unit and component tests sit next to their source as `*.test.ts(x)`. E2E tests go in `e2e/*.spec.ts`. The two runners ignore each other's files.
- jest-dom matchers and RTL cleanup are registered globally in `vitest.setup.ts`; don't repeat them per file.
- Files marked `PLACEHOLDER` (`src/placeholder/`, `src/app/page.test.tsx`, `e2e/home.spec.ts`) only prove the tooling works. Delete each once the first real test at that layer exists. They are not coverage.

### Architecture

- [ADR-0001](docs/adr/0001-client-only-no-persistence.md): client-only. No API routes, database, auth or persistence.
- [ADR-0002](docs/adr/0002-splash-page-state-as-pure-reducer.md): the whole Splash Page is one plain, serialisable object changed only by a pure reducer. The reducer is the authority for domain rules; the UI reflects it.

Intended module layout (create these test-first; they don't exist yet):

- `src/splash-page/`: the Splash Page type, the reducer and its actions
- `src/editor/`: the Editor controls, which dispatch actions
- `src/preview/`: renders a Splash Page for a given Device
- `src/app/page.tsx`: the single route, wiring Editor and Preview around shared reducer state

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues on MylesJPritchett/Captivator, using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Uses the five default label names (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
