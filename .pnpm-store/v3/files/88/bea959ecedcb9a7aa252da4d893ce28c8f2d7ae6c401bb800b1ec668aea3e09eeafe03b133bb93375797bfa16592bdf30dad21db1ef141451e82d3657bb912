# preferred-pm

> Returns the preferred package manager of a project

[![npm version](https://img.shields.io/npm/v/preferred-pm.svg)](https://www.npmjs.com/package/preferred-pm)

* Inside a Yarn workspace, Yarn is preferred.
* Inside a pnpm workspace, pnpm is preferred.
* If a `package-lock.json` is present, npm is preferred.
* If a `yarn.lock` is present, Yarn is preferred.
* If a `pnpm-lock.yaml` is present, pnpm is preferred.
* If a `node_modules` is present, tries to detect which package manager installed it.

## Installation

```
<pnpm|yarn|npm> add preferred-pm
```

## Usage

```js
'use strict'
const preferredPM = require('preferred-pm')

preferredPM(process.cwd())
    .then(pm => console.log(pm))
//> {name: "npm", version: ">=5"}
```

## Related

* [which-pm](https://github.com/zkochan/packages/tree/master/which-pm) - Detects what package manager was used for installation
* [which-pm-runs](https://github.com/zkochan/packages/tree/master/which-pm-runs) - Detects what package manager executes the process

## License

[MIT](LICENSE) © [Zoltan Kochan](https://kochan.io)
