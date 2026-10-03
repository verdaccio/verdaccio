---
'@verdaccio/api': patch
---

Improve validation of Search v1 query parameters.

`size` and `from` now accept only a single plain value; anything else, including repeated parameters, falls back to the default page size and offset, as other non-numeric values already did. Only plain string parameters are forwarded to uplinks. Registry configuration does not need to change.
