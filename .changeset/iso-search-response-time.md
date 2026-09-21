---
'@verdaccio/api': patch
---

Return the Search v1 response `time` as an ISO 8601 UTC timestamp with millisecond precision, such as `2026-09-21T10:20:30.123Z`, instead of a textual GMT date.

The timestamp represents when Verdaccio prepares the completed search response, including empty pages and results from local packages or uplinks. Package publication dates are unchanged.

Clients that parse the previous textual GMT representation should accept the ISO 8601 `time` value.
