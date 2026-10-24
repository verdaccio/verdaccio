---
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
---

Show the bun publish command and the bun login note in the web UI help guide only while the bun tab is selected.

The help guide listed `bun publish --registry <url>` and the note about bun having no login command whenever `bun` was in `web.pkgManagers`, which it is by default, so npm, pnpm and yarn users saw bun instructions too. Both now follow the client chosen in the first step: the bun tab shows `bun publish`, every other tab shows `npm publish`. Removing `bun` from `web.pkgManagers` still hides the bun tab entirely.
