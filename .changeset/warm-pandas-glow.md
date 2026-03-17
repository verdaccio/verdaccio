---
'@verdaccio/middleware': patch
---

fix: handle missing host header in URL basename resolution

Use `URL.canParse()` before constructing a `new URL()` for basename extraction in `renderHTML`, falling back to the raw base string when the URL is not parseable (e.g., when the request has no host header).
