# which-pm

> Detects what package manager was used for installation

[![npm version](https://img.shields.io/npm/v/which-pm.svg)](https://www.npmjs.com/package/which-pm)

Can detect [npm](https://github.com/npm/cli), [pnpm](https://github.com/pnpm/pnpm) and [yarn](https://github.com/yarnpkg/yarn).

## Installation

```bash
<pnpm|yarn|npm> add which-pm
```

## Usage

```js
'use strict'
const whichpm = require('which-pm')

whichpm(process.cwd())
    .then(pm => console.log(pm))
    .catch(err => console.error(err))
//> {name: "pnpm", version: "0.64.2"}
```

## Related

* [preferred-pm](https://github.com/zkochan/packages/tree/master/preferred-pm) - Returns the preferred package manager of a project
* [which-pm-runs](https://github.com/zkochan/packages/tree/master/which-pm-runs) - Detects what package manager executes the process

## License

[MIT](LICENSE) © [Zoltan Kochan](https://kochan.io)
