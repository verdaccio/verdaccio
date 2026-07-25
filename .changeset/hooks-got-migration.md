---
'@verdaccio/hooks': patch
---

fix: replace got-cjs with got in the notify webhook client

The ESM build of `@verdaccio/hooks` 8.1.0 could not send notifications: the default
import of the CommonJS `got-cjs` package resolved to the whole `module.exports` object
under Node.js ESM interop, so every webhook call failed silently ("got is not a
function" was caught and only logged). The notification client now uses the actively
maintained `got` (v15) instead of the frozen `got-cjs` fork. Since `got` is ESM-only,
it is loaded lazily through a dynamic `import()`, which works from both the ESM and
CommonJS builds on every supported Node.js version.

The success check now also validates the actual HTTP response status instead of a
`statusCode` field parsed from the response body, and non-JSON success responses
(e.g. Slack's plain `ok`) are no longer reported as failures.
