---
'@verdaccio/ui-components': patch
---

Fix a batch of web UI bugs: the yarn global install row rendered and copied `yarn global add -g true` instead of the package name; copy-to-clipboard silently did nothing on plain-http deployments (no secure context — it now falls back to `execCommand`); the Versions tab kept showing the previously visited package's versions after navigating; Gravatar avatars never showed on the detail page (the sidebar endpoint sends `_avatar`, the UI read `avatar`); an unreachable backend rendered the "no packages published yet" onboarding panel instead of an error state (home now shows a proper error page); `fileCount`/`unpackedSize` of 0 painted a stray "0" in the sidebar and package card; and the `.yarnrc.yml` snippet in the registry info dialog used `//` comments that break YAML parsing.
