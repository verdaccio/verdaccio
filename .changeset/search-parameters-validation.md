---
'verdaccio': patch
---

Improve validation of Search v1 query parameters.

`size` and `from` now accept only plain string values; anything else falls back to the default page size and offset, as other non-numeric values already did. Only plain string parameters are forwarded to uplinks. An uplink search response that cannot be read now ends that uplink's results, and local results are still returned. Unexpected errors in the search endpoint are reported through the regular error handler. Registry configuration does not need to change.
