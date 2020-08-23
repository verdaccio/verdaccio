# no export from test file (no-export)

Prevents exports from test files. If a file has at least 1 test in it, then this
rule will prevent exports.

## Rule Details

This rule aims to eliminate duplicate runs of tests by exporting things from
test files. If you import from a test file, then all the tests in that file will
be run in each imported instance, so bottom line, don't export from a test, but
instead move helper functions into a seperate file when they need to be shared
across tests.

Examples of **incorrect** code for this rule:

```js
export function myHelper() {}

module.exports = function() {};

module.exports = {
  something: 'that should be moved to a non-test file',
};

describe('a test', () => {
  expect(1).toBe(1);
});
```

Examples of **correct** code for this rule:

```js
function myHelper() {}

const myThing = {
  something: 'that can live here',
};

describe('a test', () => {
  expect(1).toBe(1);
});
```

## When Not To Use It

Don't use this rule on non-jest test files.
