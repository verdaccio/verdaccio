---
"verdaccio": minor
---

feat: dual CJS + ESM build with `exports` field, migrate build from babel to vite 8

**Native ESM support.** The package now ships both CommonJS (`build/**/*.js`) and ESM
(`build/**/*.mjs`) outputs and declares an `exports` field, so
`import { runServer } from 'verdaccio'` resolves a real ES module instead of the
CommonJS interop. `require('verdaccio')` keeps working exactly as before. The
`verdaccio` CLI now runs on the ESM build, which means ESM-only dependencies can be
loaded at runtime on every supported Node.js version.

**Build toolchain.** Babel has been replaced by vite 8 (rolldown) for transpilation;
type declarations are still emitted by TypeScript. This is not observable in the
registry behavior, but local workflows changed: `yarn start` and the `debug/` bootstrap
scripts now use `tsx` instead of `babel-node`/`@babel/register`.
