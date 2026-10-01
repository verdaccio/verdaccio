---
'verdaccio': patch
---

Validate Search v1 query text before starting a search.

Search requests must provide a single, non-blank `text` string. Missing or invalid search text now receives HTTP 400 with the JSON error code `ERR_TEXT_MISSING`, before searching local packages or uplinks.

Earlier 6.x releases could accept searches without text. Clients that call the search API directly must now supply a non-blank query. Valid query text is preserved, and searches with no matching packages continue to return HTTP 200 with an empty results array.
