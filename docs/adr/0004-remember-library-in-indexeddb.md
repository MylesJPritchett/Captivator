# Remember the Library in IndexedDB, as one value

A Customer can keep several Splash Pages in a Library, so the roughly 5MB `localStorage` gives (ADR-0003) would fill after two or three image Backgrounds. The whole Library is now remembered in this browser's IndexedDB, through `idb-keyval`, as one value under a versioned key. Splash Pages are unchanged: images stay data URLs inside them. This supersedes ADR-0003's choice of `localStorage` but keeps the rest of it: client-only, a versioned key, unreadable saves open on the Starter Splash Page, and the Editor and Preview wait until the save has loaded.

## Considered Options

- **Keep `localStorage`.** No work, but the Library would hit the limit almost straight away.
- **Shrink images on upload and keep `localStorage`.** Saving stays synchronous, but images lose quality, jsdom can't run the canvas it needs, and a large enough Library still fills up. It's still worth doing later to cut size and load time.
- **IndexedDB with images stored separately as Blobs.** Avoids base64 inflation, but Splash Pages would hold image IDs instead of URLs, and object URLs would need managing again. That's the extra work ADR-0003 was avoiding.

## Consequences

- Loading and saving are asynchronous. Writes go through in the order they're made, so the latest Library wins.
- Running out of space is now rare rather than impossible, so ADR-0003's "saved without images" fallback stays. It drops the Open Splash Page's Logo and Background image; every other Splash Page keeps its images only if they were already saved, so images that never fitted don't stop the rest being saved.
- Tests use `fake-indexeddb`. A full or blocked store is simulated by making IndexedDB writes fail, instead of stubbing `Storage`.
- One-off exception to "no migrations": the first time it loads, a Splash Page remembered under ADR-0003's `localStorage` key becomes the Library's only Splash Page, named "My Splash Page", and the old key is removed.
