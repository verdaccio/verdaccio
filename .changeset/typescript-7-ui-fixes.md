---
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
---

Fix type resolution for the TypeScript 7 upgrade: switch the UI packages to `moduleResolution: bundler` (required to resolve react-router 8 types via its `exports` map), declare `@mui/system` as a direct dependency so emitted declarations can reference its types portably, and replace the legacy `@mui/material/styles/createTheme` module augmentation with the `@mui/material/styles` entry point.
