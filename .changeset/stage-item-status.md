---
'@verdaccio/store': minor
---

Include `status: "staged"` in staged version listings and details so npm stage clients can show that a version is ready for maintainer review and approval.

Verdaccio has no asynchronous validation phase, so every staged item reports `staged`. Existing staged versions receive the field when read; no storage migration or configuration change is required.
