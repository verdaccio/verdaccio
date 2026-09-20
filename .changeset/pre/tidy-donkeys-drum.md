---
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
---

fix(ui): drop `credentials: 'include'` from the tarball download fetch. Web-UI auth travels in the `Authorization: Bearer` header, not cookies, so `include` gained nothing but made the browser reject the registry's wildcard `Access-Control-Allow-Origin: *` on cross-origin downloads (e.g. `pnpm start`, where the UI dev server on :4873 fetches tarballs from the registry on :8000), breaking the download-tarball button with a CORS error.
