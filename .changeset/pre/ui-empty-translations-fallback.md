---
'@verdaccio/ui-theme': patch
---

Show untranslated web UI strings in English instead of leaving them blank after switching the UI language.

The Crowdin export bundled with the UI can carry strings nobody has translated yet as empty values. The UI took those as valid translations, so in every language other than English large parts of the interface (security settings, package stages, the help guide, the package list toolbar, package manager names) rendered as empty labels and buttons. Empty strings now fall back to English, the same as strings missing from a translation. No configuration change is needed; the translation progress shown in the settings dialog was already correct.
