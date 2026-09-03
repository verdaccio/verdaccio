---
'@verdaccio/ui-theme': patch
'@verdaccio/ui-i18n': patch
---

Sync the two crowdin `ui.json` sources: the bundled ui-theme copy was missing the whole `security.*` namespace (web login, add user and change password pages rendered raw i18n keys) while the `@verdaccio/ui-i18n` copy was missing the `stage.*` namespace; the `about` tab label key was missing from both. A parity test now keeps both files aligned.
