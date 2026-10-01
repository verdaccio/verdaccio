---
'@verdaccio/api': patch
---

Return HTTP 400 with `ERR_TEXT_MISSING` when Search v1 receives no usable `text` query parameter.

Earlier releases in the 9.x API line could treat missing or blank search text as a successful search with no results. The endpoint now requires a single string containing at least one non-whitespace character. Missing, empty, whitespace-only, or repeated values are rejected before searching local packages or uplinks, with npm's JSON error message and code.

Clients calling `GET /-/v1/search` directly must supply a non-blank `text` value. A valid search with no matching packages still returns HTTP 200 with an empty results array.
