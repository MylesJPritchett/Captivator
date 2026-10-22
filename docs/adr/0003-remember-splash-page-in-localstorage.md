# Remember the Splash Page in localStorage, images as data URLs

A Customer's Splash Page, including its uploaded Logo and Background images, is remembered in this browser so that a refresh doesn't lose their work. The whole Splash Page object (ADR-0002) is saved to `localStorage` under a versioned key, and uploaded images are stored in it as data URLs instead of in-memory object URLs. This supersedes ADR-0001's "lost on refresh" and "object URLs" points but keeps its core: no backend, nothing shared between browsers.

## Considered Options

- **Text and colours only, images dropped on refresh.** Simplest, but the Customer loses the images they care about most.
- **IndexedDB for image blobs.** No practical size limit, but the Splash Page would hold image IDs rather than URLs, loading becomes asynchronous, and jsdom needs a fake IndexedDB. Two to three times the work for a demo.

## Consequences

- `localStorage` holds about 5MB and base64 inflates images by about a third, so large images can fail to save. When that happens the Splash Page is saved without its images and the Customer is told so; the design keeps working in memory. Shrinking images on upload, or moving images to IndexedDB, are the follow-ups if this bites.
- A saved Splash Page that can't be read (corrupt, or saved under an older version key) is discarded for the Starter Splash Page. There are no migrations.
- The saved Splash Page can only be read after the page loads in the browser, so the Editor and Preview wait until it is loaded rather than flashing the Starter Splash Page.
