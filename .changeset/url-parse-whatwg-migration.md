---
"verdaccio": patch
---

fix: migrate uplink/storage URL parsing to the WHATWG URL API

Removes the `[DEP0169] DeprecationWarning: url.parse()` printed at startup on
Node.js 22+. The proxy and local-storage layers no longer use the legacy `url.parse()`
/ `url.format()` helpers; uplink URL validation, distfile filename extraction, and the
remote-protocol tarball rewrite now go through the standardized `URL` API. Behavior is
unchanged for the absolute HTTP(S) URLs used in practice — the default HTTPS port `:443`
still normalizes to a match, and invalid uplink URLs are treated as not-valid instead of
being parsed leniently.
