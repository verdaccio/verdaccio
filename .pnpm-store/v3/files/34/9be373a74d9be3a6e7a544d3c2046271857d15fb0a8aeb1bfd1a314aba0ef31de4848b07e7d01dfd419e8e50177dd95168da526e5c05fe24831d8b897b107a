# disallow large snapshots (no-large-snapshots)

When using Jest's snapshot capability one should be mindful of the size of
created snapshots. As a best practice snapshots should be limited in size in
order to be more manageable and reviewable. A stored snapshot is only as good as
its review and as such keeping it short, sweet, and readable is important to
allow for thorough reviews.

## Usage

Because Jest snapshots are written with back-ticks (\` \`) which are only valid
with
[ES2015 onwards](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
you should set `parserOptions` in your config to at least allow ES2015 in order
to use this rule:

```js
parserOptions: {
  ecmaVersion: 2015,
},
```

## Rule Details

This rule looks at all Jest inline and external snapshots (files with `.snap`
extension) and validates that each stored snapshot within those files does not
exceed 50 lines (by default, this is configurable as explained in `Options`
section below).

Example of **incorrect** code for this rule:

```js
exports[`a large snapshot 1`] = `
line 1
line 2
line 3
line 4
line 5
line 6
line 7
line 8
line 9
line 10
line 11
line 12
line 13
line 14
line 15
line 16
line 17
line 18
line 19
line 20
line 21
line 22
line 23
line 24
line 25
line 26
line 27
line 28
line 29
line 30
line 31
line 32
line 33
line 34
line 35
line 36
line 37
line 38
line 39
line 40
line 41
line 42
line 43
line 44
line 45
line 46
line 47
line 48
line 49
line 50
line 51
`;
```

Example of **correct** code for this rule:

```js
exports[`a more manageable and readable snapshot 1`] = `
line 1
line 2
line 3
line 4
`;
```

## Options

This rule has options for modifying the max number of lines allowed for a
snapshot:

In an `eslintrc` file:

```json
...
  "rules": {
    "jest/no-large-snapshots": ["warn", { "maxSize": 12, "inlineMaxSize": 6 }]
  }
...
```

Max number of lines allowed could be defined by snapshot type (Inline and
External). Use `inlineMaxSize` for
[Inline Snapshots](https://jestjs.io/docs/en/snapshot-testing#inline-snapshots)
size and `maxSize` for
[External Snapshots](https://jestjs.io/docs/en/snapshot-testing#snapshot-testing-with-jest).
If only `maxSize` is provided on options, the value of `maxSize` will be used to
both snapshot types (Inline and External).

In addition there is an option for whitelisting large snapshot files. Since
`//eslint` comments will be removed when a `.snap` file is updated, this option
provides a way of whitelisting large snapshots. The list of whitelistedSnapshots
is keyed first on the absolute filepath of the snapshot file. You can then
provide an array of strings to match the snapshot names against. If you're using
a `.eslintrc.js` file, you can use regular expressions AND strings.

In an `.eslintrc.js` file:

```javascript
...

  "rules": {
    "jest/no-large-snapshots": ["error",
      {
        "whitelistedSnapshots": {
          "/path/to/file.js.snap": ["snapshot name 1", /a big snapshot \d+/]
        }
      }]
  }

...
```

Note: If you store your paths as relative paths, you can use `path.resolve` so
that it can be shared between computers. For example, suppose you have your
whitelisted snapshots in a file called `allowed-snaps.js` which stores them as
relative paths. To convert them to absolute paths you can do something like the
following:

```javascript
const path = require('path');
const {mapKeys} = require('lodash');


const allowedSnapshots = require('./allowed-snaps.js');
const whitelistedSnapshots = mapKeys(allowedSnapshots, (val, file) => path.resolve(__dirname, file));

...
  rules: {
    "jest/no-large-snapshots": ["error",
      { whitelistedSnapshots }
    ]
  }
```
