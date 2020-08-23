# is-subdir

> Return whether a directory is a subdirectory of another directory

<!--@shields('npm')-->
[![npm version](https://img.shields.io/npm/v/is-subdir.svg)](https://www.npmjs.com/package/is-subdir)
<!--/@-->

Cross-platform. Works correctly on Windows, where directory paths can start with disk drive letters in different casings. Like `c:\foo` and `C:\foo\bar`.

Returns `true` when the directories match.

## Installation

```sh
<npm|yarn|pnpm> add is-subdir
```

## Usage

```js
'use strict'
const path = require('path')
const isSubdir = require('is-subdir')

console.log(isSubdir(process.cwd(), path.resolve('node_modules')))
//> true
```

## API

### `isSubdir(parentDir, subdir): boolean`

## License

[MIT](./LICENSE) © [Zoltan Kochan](https://www.kochan.io)
