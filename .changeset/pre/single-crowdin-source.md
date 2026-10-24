---
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
'@verdaccio/config': patch
---

Show how much of each language is translated in the web UI settings, and translate the UI from a single Crowdin source file.

The Translations tab of the settings dialog now shows the translated percentage of every language on smaller, keyboard-accessible cards, and links to a short guide on how to contribute translations or request a new language. Crowdin now exports only translated strings, so untranslated keys keep falling back to English while the percentage reflects real progress.

The UI strings were uploaded to Crowdin twice, once from `@verdaccio/ui-i18n` and once from a copy inside `@verdaccio/ui-theme`, and the two copies had already drifted apart once. The strings and the downloaded translations now live in `@verdaccio/ui-components`, next to the components that render them, which also exports `loadTranslationFile()` and bundles every downloaded language at build time. `@verdaccio/ui-theme` uses that loader instead of its own copy, and the translations link in the default configuration files points to the new guide.

`@verdaccio/ui-i18n` is no longer released from this line. Its published loader only ever returned English for builds, because the downloaded translations were never part of its package; use `loadTranslationFile` from `@verdaccio/ui-components` instead. No configuration changes are required.
