---
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
---

Fix type resolution for the TypeScript 7 upgrade: switch the UI packages to `moduleResolution: bundler` (required to resolve react-router 8 types via its `exports` map), declare `@mui/system` as a direct dependency so emitted declarations can reference its types portably, and replace the legacy `@mui/material/styles/createTheme` module augmentation with the `@mui/material/styles` entry point.

Also dedupe `i18next`/`react-i18next` in the ui-theme bundle: pnpm can materialize one i18next copy per typescript peer-resolution context, and a duplicated instance left the settings dialog's language list empty.

The Cypress e2e specs are now bundled with Vite (the default webpack/ts-loader preprocessor requires the TypeScript JS compiler API, which TypeScript 7 no longer ships).
