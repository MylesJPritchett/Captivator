# Splash Page state is a pure reducer over one object

The whole Splash Page design is a single plain, serialisable object, changed only through a pure reducer (`(splashPage, action) => splashPage`) and shared by the Editor and Preview. Domain rules, such as "at most two Input Fields, never two of the same type", live in the reducer and are unit-tested there. Components stay thin and are tested with React Testing Library. We chose this over component-local state and over a store library (Zustand, Redux) because it gives the fastest, dependency-free red-green loop for TDD and a single source of truth that a live Preview needs anyway.

## Consequences

- Rules must not be enforced only in the UI (e.g. by disabling a button). The reducer is the authority, and the UI reflects it.
- The object's shape is the natural seam for adding persistence later (see ADR-0001).
