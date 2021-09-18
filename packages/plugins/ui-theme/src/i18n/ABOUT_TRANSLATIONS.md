## Translate UI Strings

If you are willing to translate User Interfances strings, are located in the `crowdin` project which is available [here](https://crowdin.com/project/verdaccio) at `packages/plugins/src/i18n/crowdin/ui.json`.

### Requirements

- Need a crowdin account, use your GitHub account for fast access as an option.

### Adding a new language to the UI

- If the language is not available, ask in the Discord channel to enable it, that will be pretty fast.
- After you have translated the strings, add to `packages/plugins/ui-theme/src/i18n/enabledLanguages.ts` the configuration for the new language.
- In development mode the file must not be available since you need admin credentials to download translations, as a work around, create a folder withing the `crowdin` folder eg: `/packages/plugins/ui-theme/src/i18n/download_translations/fr-FR/ui.json` and then will be available for testing. If the language is not found, will fallback to `en-US`.
