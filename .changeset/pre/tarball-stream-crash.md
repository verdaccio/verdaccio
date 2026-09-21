---
'@verdaccio/local-storage': patch
'@verdaccio/api': patch
'@verdaccio/store': patch
---

Fix the registry process crashing during concurrent tarball downloads.

The tarball size was emitted through an async `fstat` racing the first data
chunk — two unordered parallel I/O completions. When the chunk won (roughly 1
in 2000 requests under concurrent load), the response headers were already
flushed and setting `Content-Length` threw an uncaught `ERR_HTTP_HEADERS_SENT`
that killed the whole process. Verdaccio 6.x was immune because its legacy
storage only started piping data from inside the `fstat` callback; the 9.x
streams refactor silently lost that ordering guarantee.

Fixed on three layers: `local-storage` now emits the size synchronously on
`open` (restoring size-before-data ordering), the API skips the header once
headers are sent instead of throwing, and the unguarded `await pipeline(...)`
calls in the store's tarball read/write paths log a warning instead of taking
the process down through an unhandled rejection on mid-stream failures. A
failed upload no longer records the tarball in the manifest `_attachments`.
