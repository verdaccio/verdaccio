---
'@verdaccio/ui-theme': patch
---

Fix the web UI failing to load parts of itself when Verdaccio is served under `url_prefix`.

The UI loads some of its files on demand, such as the code and styles of the package detail page. Those requests went to `/-/static/` at the root of the host instead of below `url_prefix`, so behind a reverse proxy that only forwards the prefix they failed with 404. Package pages then showed "Something went wrong", and other pages could lose styles. The UI now requests these files relative to its own location, so they follow `url_prefix`. Registries served at the root of a host behave as before.

This affected `@verdaccio/ui-theme` 9.0.0-next-9.2 and later, the web UI Verdaccio 6 and 7 ship. A reverse proxy rule that forwards `/-/static/` at the root to Verdaccio as a workaround is no longer needed.

No configuration change is needed.
