# Client-only, no persistence

Captivator is a 4-hour MVP whose job is to let a Customer mock up a Splash Page and see it live, so it runs entirely in the browser: no API routes, no database, no auth. Uploaded Logo and Background images are held as in-memory object URLs and the design is lost on refresh. A backend would add hours of work and test surface without serving the demo. Saving to `localStorage` is an optional stretch goal that keeps this decision intact.

## Consequences

- Nothing can be shared between devices or Customers. Real persistence would need a storage decision (e.g. image hosting) that this ADR deliberately leaves open.
- Everything is testable in jsdom and Playwright with no services to stub.
