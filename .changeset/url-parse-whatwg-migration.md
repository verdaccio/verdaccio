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

Because the WHATWG `URL` constructor throws on malformed input (unlike the lenient legacy
`url.parse()`), a misconfigured uplink `url` now fails fast at startup with a clear,
credential-redacted error, and a malformed `dist.tarball` returned by an upstream registry
is skipped (with a warning) instead of aborting the package update. Uplink URL validation
also now compares the uplink's own port when deciding whether to ignore the default HTTPS
port, so an HTTPS uplink on a non-default port no longer matches a default-port tarball.
