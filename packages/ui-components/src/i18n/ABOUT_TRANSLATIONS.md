## Translate the Verdaccio UI

The web UI is translated by the community on [Crowdin](https://crowdin.com/project/verdaccio).

1. Open the [Verdaccio Crowdin project](https://crowdin.com/project/verdaccio) and sign in (a GitHub account works).
2. Pick your language and translate the missing strings of `ui.json`. No approval is needed.
3. Translations ship with the next Verdaccio release; the settings dialog shows each language's progress.

### Adding a new language

1. If the language is not available in Crowdin, ask in the `#contribute` channel on [Discord](https://discord.gg/7qWJxBf) to enable it.
2. Add its name under `lng` in `packages/ui-components/src/i18n/crowdin/ui.json`, e.g. `{ "lng": { "korean": "Korean" } }`.
3. Add the language, its flag and menu key to `packages/plugins/ui-theme/src/i18n/enabledLanguages.ts`.

### Testing locally

Downloading translations requires Crowdin credentials. To test a language locally, create
`packages/ui-components/src/i18n/download_translations/<locale>/ui.json` (e.g. `fr-FR`) with the
strings you want to check and rebuild; missing strings fall back to English.
