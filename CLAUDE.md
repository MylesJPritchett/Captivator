## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) for every commit message: `<type>(<optional scope>): <description>`, e.g. `feat(editor): add background colour picker` or `fix: keep preview in sync on resize`. Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`. Git's default merge messages (`Merge branch …`, `Merge pull request …`) are exempt, matching commitlint's defaults.

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

Locally, `pnpm test:e2e` reuses any server already listening on its port, including `pnpm dev`. Set `PLAYWRIGHT_PORT` (default 3000) to a free port to test your own production build, e.g. when parallel agents each run E2E.

Before saying work is done, run `format:check`, `lint`, `typecheck` and `test`. Run `test:e2e` when you touch browser behaviour. On NixOS, `playwright.config.ts` uses the system `chromium` automatically; `PLAYWRIGHT_CHROMIUM_EXECUTABLE` overrides it.

### Red-green-refactor

- Never write production code without a failing test that needs it. Write one test, watch it fail for the right reason, write the least code to pass, repeat.
- One vertical slice at a time: one test, one implementation. Don't write a batch of tests up front.
- Refactor only when green, and keep the tests green while you do.

### Seams

Test only at these three seams. Don't add others without agreeing it with the developer.

1. **The Splash Page reducer** (Vitest, pure functions). Domain rules live and are tested here, e.g. "at most two Input Fields, never two of the same type". Assert on the returned Splash Page given a starting Splash Page and an action, or on the exported starter Splash Page.
2. **The Editor and Preview rendered together** (React Testing Library in jsdom). This is the primary seam: a Customer changes something in the Editor and the Preview shows it. No isolated tests per Editor control.
3. **A real browser** (Playwright, `e2e/`). Only a few happy paths that jsdom fakes poorly: the Device toggle, real layout, file upload.

### Writing tests

- Test behaviour through public interfaces, never implementation details. Don't assert on internal state, hook calls or class names.
- Query by role or label (`getByRole`, `getByLabelText`); act with `@testing-library/user-event`. user-event can't drive native colour or range inputs; set those with `fireEvent.change` (`pickColour` for colours). Fall back to text only when no role or label fits.
- Use `GLOSSARY.md` terms in test names and code: Splash Page, Logo, Background, Text Block, Input Field, Connect Button, Editor, Preview, Device, Customer, Guest. Avoid the listed aliases.
- Unit and component tests sit next to their source as `*.test.ts(x)`. E2E tests go in `e2e/*.spec.ts`. The two runners ignore each other's files.
- Reducer tests: `src/splash-page/<area>.test.ts`. Editor + Preview tests: `src/app/page.<area>.test.tsx`, with page-wide behaviour in `page.test.tsx`. Share setup through `src/app/test-helpers.tsx` (`renderCaptivator`, `stubObjectUrls`, `imageFile`, `pickColour`).
- jest-dom matchers and RTL cleanup are registered globally in `vitest.setup.ts`; don't repeat them per file.

### Architecture

- [ADR-0001](docs/adr/0001-client-only-no-persistence.md): client-only. No backend: no API routes, database or auth. The Library is remembered only in this browser, per ADR-0004.
- [ADR-0002](docs/adr/0002-splash-page-state-as-pure-reducer.md): the whole Splash Page is one plain, serialisable object changed only by a pure reducer. The reducer is the authority for domain rules; the UI reflects it.
- [ADR-0004](docs/adr/0004-remember-library-in-indexeddb.md): the whole Library, images as data URLs inside its Splash Pages, is remembered in this browser's IndexedDB (through `idb-keyval`) as one value under a versioned key. Older or unreadable saves open on a Library holding one Starter Splash Page. It replaces [ADR-0003](docs/adr/0003-remember-splash-page-in-localstorage.md)'s `localStorage`, whose saved Splash Page is carried over once. Tests use `fake-indexeddb`.

Module layout. Each area (Logo, Background, Text Blocks, Input Fields, Connect Button) has its own file in each of the first three:

- `src/splash-page/`: the Splash Page and Library types, the starter Splash Page, the Splash Page reducer, which combines one reducer per area, and the Library reducer (`library.ts`), which owns the Library's own actions and passes every other action to the Splash Page reducer for the Open Splash Page; plus remembering the Library (`remembered.ts`)
- `src/editor/`: one Editor section per area, which dispatches actions; shared `ImageUpload` and `ColourControl`
- `src/preview/`: renders a Splash Page for a given Device; the Device toggle and frames
- `src/library/`: the Library list, with its New Splash Page button
- `src/ui/`: pieces shared by the Editor and the Preview (segmented control, focus ring)
- `src/app/page.tsx`: the single route, holding the Library reducer and Device state and wiring the Library, Editor and Preview together

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues on MylesJPritchett/Captivator, using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Uses the five default label names (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
