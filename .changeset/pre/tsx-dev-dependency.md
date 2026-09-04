---
'@verdaccio/cli': patch
---

Move `tsx` to `devDependencies`

`tsx` is only used by the package's `start` script, but it was listed as a runtime dependency, so every install of `verdaccio` also pulled in `esbuild` (~10MB) and its `postinstall` script. Nothing in the published build references `tsx`.
