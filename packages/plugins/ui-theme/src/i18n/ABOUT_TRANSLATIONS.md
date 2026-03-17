## Translate UI Strings

If you would like to translate the user interface strings, they are located in the `crowdin` project available [here](https://crowdin.com/project/verdaccio) at `packages/plugins/src/i18n/crowdin/ui.json`.

### Requirements

- A Crowdin account is required. You can use your GitHub account for quick access.

### Adding a new language to the UI

- If the language is not available, ask in the Discord channel to enable it. This is usually done quickly.
- After you have translated the strings, add the configuration for the new language to `packages/plugins/ui-theme/src/i18n/enabledLanguages.ts`.
- In development mode, the translated file will not be available since admin credentials are required to download translations. As a workaround, create a folder within the `crowdin` folder (e.g., `/packages/plugins/ui-theme/src/i18n/download_translations/fr-FR/ui.json`) and it will be available for testing. If the language is not found, it will fall back to `en-US`.
