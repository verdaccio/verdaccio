# dotgitignore

[![Build Status](https://travis-ci.org/bcoe/dotgitignore.svg)](https://travis-ci.org/bcoe/dotgitignore)

find the closest .gitignore file, parse it, and apply ignore rules.

## Usage

_Given the following `.gitignore`:_

```
.DS_Store
node_modules
coverage
.nyc_output
```

```js
const dotgit = require('dotgitignore')()
dotgit.ignore('.DS_Store') // returns 'true'.
dotgit.ignore('README.md') // returns 'false'.
```

## API

* `require('dotgitignore')([opts])`: return instance of `dotgitignore`, optionally
  configured with `opts`:
  * `opts.cwd`: current working directory (defaults to process.cwd()).
* `dotgit.ignore(name)`: returns `true` if pattern is ignored, `false` otherwise.