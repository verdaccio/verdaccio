---
'verdaccio': patch
---

fix: run jwt middleware before middleware plugins

Register the JWT middleware before middleware plugins are loaded so that
`req.remote_user` (anonymous by default) is available inside a plugin's
`register_middlewares`. The API router keeps its own JWT middleware behind a
guard so it is not executed twice.

Backport of https://github.com/verdaccio/verdaccio/pull/5697

Closes #5167
