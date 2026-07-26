---
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
'@verdaccio/cli': patch
---

Fix type resolution for the TypeScript 7 upgrade: switch the UI packages to `moduleResolution: bundler` (required to resolve react-router 8 types via its `exports` map), declare `@mui/system` as a direct dependency so emitted declarations can reference its types portably, and replace the legacy `@mui/material/styles/createTheme` module augmentation with the `@mui/material/styles` entry point.

Declaration files are now emitted with the TypeScript compiler itself (`tsc --emitDeclarationOnly`) instead of `vite-plugin-dts`, which has no JS compiler API to hook into on TypeScript 7. This drops the `@typescript/typescript6` fallback install (and with it a duplicated i18next instance that left the settings dialog's language list empty). `runCli()` in `@verdaccio/cli` is now correctly typed as `Promise<void>` — the previous `Promise<number>` annotation was wrong and only survived because the old declaration generator ignored type errors.

The Cypress e2e specs are now bundled with Vite (the default webpack/ts-loader preprocessor requires the TypeScript JS compiler API, which TypeScript 7 no longer ships).
