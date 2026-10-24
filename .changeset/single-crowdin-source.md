---
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
---

Translate the web UI from a single Crowdin source file that now lives in `@verdaccio/ui-components`.

The UI strings were uploaded to Crowdin twice, once from `@verdaccio/ui-i18n` and once from a copy inside `@verdaccio/ui-theme`, and the two copies had already drifted apart once. The strings and the downloaded translations now live in `@verdaccio/ui-components`, next to the components that render them, which also exports `loadTranslationFile()` and bundles every downloaded language at build time. `@verdaccio/ui-theme` uses that loader instead of its own copy.

`@verdaccio/ui-i18n` is no longer released from this line. Its published loader only ever returned English for builds, because the downloaded translations were never part of its package; use `loadTranslationFile` from `@verdaccio/ui-components` instead. The shipped UI and its languages are unchanged, and no configuration changes are required.
