<div align="center">
  <a href="https://eslint.org/">
    <img width="150" height="150" src="https://eslint.org/assets/img/logo.svg">
  </a>
  <a href="https://facebook.github.io/jest/">
    <img width="150" height="150" vspace="" hspace="25" src="https://jestjs.io/img/jest.png">
  </a>
  <h1>eslint-plugin-jest</h1>
  <p>ESLint plugin for Jest</p>
</div>

[![Actions Status](https://github.com/jest-community/eslint-plugin-jest/workflows/Unit%20tests/badge.svg?branch=master)](https://github.com/jest-community/eslint-plugin-jest/actions)
[![Renovate badge](https://badges.renovateapi.com/github/jest-community/eslint-plugin-jest)](https://renovatebot.com/)

## Installation

```
$ yarn add --dev eslint eslint-plugin-jest
```

**Note:** If you installed ESLint globally then you must also install
`eslint-plugin-jest` globally.

## Usage

Add `jest` to the plugins section of your `.eslintrc` configuration file. You
can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["jest"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error"
  }
}
```

You can also whitelist the environment variables provided by Jest by doing:

```json
{
  "env": {
    "jest/globals": true
  }
}
```

## Shareable configurations

### Recommended

This plugin exports a recommended configuration that enforces good testing
practices.

To enable this configuration use the `extends` property in your `.eslintrc`
config file:

```json
{
  "extends": ["plugin:jest/recommended"]
}
```

### Style

This plugin also exports a configuration named `style`, which adds some
stylistic rules, such as `prefer-to-be-null`, which enforces usage of `toBeNull`
over `toBe(null)`.

To enable this configuration use the `extends` property in your `.eslintrc`
config file:

```json
{
  "extends": ["plugin:jest/style"]
}
```

See
[ESLint documentation](http://eslint.org/docs/user-guide/configuring#extending-configuration-files)
for more information about extending configuration files.

### All

If you want to enable all rules instead of only some you can do so by adding the
`all` configuration to your `.eslintrc` config file:

```json
{
  "extends": ["plugin:jest/all"]
}
```

While the `recommended` and `style` configurations only change in major versions
the `all` configuration may change in any release and is thus unsuited for
installations requiring long-term consistency.

## Rules

| Rule                           | Description                                                       | Configurations   | Fixable             |
| ------------------------------ | ----------------------------------------------------------------- | ---------------- | ------------------- |
| [consistent-test-it][]         | Enforce consistent test or it keyword                             |                  | ![fixable-green][]  |
| [expect-expect][]              | Enforce assertion to be made in a test body                       | ![recommended][] |                     |
| [lowercase-name][]             | Disallow capitalized test names                                   |                  | ![fixable-green][]  |
| [no-alias-methods][]           | Disallow alias methods                                            | ![style][]       | ![fixable-green][]  |
| [no-commented-out-tests][]     | Disallow commented out tests                                      | ![recommended][] |                     |
| [no-disabled-tests][]          | Disallow disabled tests                                           | ![recommended][] |                     |
| [no-duplicate-hooks][]         | Disallow duplicate hooks within a `describe` block                |                  |                     |
| [no-expect-resolves][]         | Disallow using `expect().resolves`                                |                  |                     |
| [no-export][]                  | Disallow export from test files                                   | ![recommended][] |                     |
| [no-focused-tests][]           | Disallow focused tests                                            | ![recommended][] |                     |
| [no-hooks][]                   | Disallow setup and teardown hooks                                 |                  |                     |
| [no-identical-title][]         | Disallow identical titles                                         | ![recommended][] |                     |
| [no-if][]                      | Disallow conditional logic                                        |                  |                     |
| [no-jasmine-globals][]         | Disallow Jasmine globals                                          | ![recommended][] | ![fixable-yellow][] |
| [no-jest-import][]             | Disallow importing `jest`                                         | ![recommended][] |                     |
| [no-large-snapshots][]         | Disallow large snapshots                                          |                  |                     |
| [no-mocks-import][]            | Disallow manually importing from `__mocks__`                      | ![recommended][] |                     |
| [no-standalone-expect][]       | Prevents `expect` statements outside of a `test` or `it` block    | ![recommended][] |                     |
| [no-test-callback][]           | Using a callback in asynchronous tests                            | ![recommended][] | ![fixable-green][]  |
| [no-test-prefixes][]           | Disallow using `f` & `x` prefixes to define focused/skipped tests | ![recommended][] | ![fixable-green][]  |
| [no-test-return-statement][]   | Disallow explicitly returning from tests                          |                  |                     |
| [no-truthy-falsy][]            | Disallow using `toBeTruthy()` & `toBeFalsy()`                     |                  |                     |
| [no-try-expect][]              | Prevent `catch` assertions in tests                               | ![recommended][] |                     |
| [prefer-called-with][]         | Suggest using `toBeCalledWith()` OR `toHaveBeenCalledWith()`      |                  |                     |
| [prefer-expect-assertions][]   | Suggest using `expect.assertions()` OR `expect.hasAssertions()`   |                  |                     |
| [prefer-hooks-on-top][]        | Suggest to have all hooks at top-level before tests               |                  |                     |
| [prefer-inline-snapshots][]    | Suggest using `toMatchInlineSnapshot()`                           |                  | ![fixable-green][]  |
| [prefer-spy-on][]              | Suggest using `jest.spyOn()`                                      |                  | ![fixable-green][]  |
| [prefer-strict-equal][]        | Suggest using `toStrictEqual()`                                   |                  | ![fixable-green][]  |
| [prefer-to-be-null][]          | Suggest using `toBeNull()`                                        | ![style][]       | ![fixable-green][]  |
| [prefer-to-be-undefined][]     | Suggest using `toBeUndefined()`                                   | ![style][]       | ![fixable-green][]  |
| [prefer-to-contain][]          | Suggest using `toContain()`                                       | ![style][]       | ![fixable-green][]  |
| [prefer-to-have-length][]      | Suggest using `toHaveLength()`                                    | ![style][]       | ![fixable-green][]  |
| [prefer-todo][]                | Suggest using `test.todo()`                                       |                  | ![fixable-green][]  |
| [require-top-level-describe][] | Require a top-level `describe` block                              |                  |                     |
| [require-to-throw-message][]   | Require that `toThrow()` and `toThrowError` includes a message    |                  |                     |
| [valid-describe][]             | Enforce valid `describe()` callback                               | ![recommended][] |                     |
| [valid-expect-in-promise][]    | Enforce having return statement when testing with promises        | ![recommended][] |                     |
| [valid-expect][]               | Enforce valid `expect()` usage                                    | ![recommended][] |                     |
| [valid-title][]                | Enforce valid titles for jest blocks                              |                  |                     |

## Credit

- [eslint-plugin-mocha](https://github.com/lo1tuma/eslint-plugin-mocha)
- [eslint-plugin-jasmine](https://github.com/tlvince/eslint-plugin-jasmine)

## Related Projects

### eslint-plugin-jest-formatting

This project aims to provide formatting rules (auto-fixable where possible) to
ensure consistency and readability in jest test suites.

https://github.com/dangreenisrael/eslint-plugin-jest-formatting

[consistent-test-it]: docs/rules/consistent-test-it.md
[expect-expect]: docs/rules/expect-expect.md
[lowercase-name]: docs/rules/lowercase-name.md
[no-alias-methods]: docs/rules/no-alias-methods.md
[no-commented-out-tests]: docs/rules/no-commented-out-tests.md
[no-disabled-tests]: docs/rules/no-disabled-tests.md
[no-duplicate-hooks]: docs/rules/no-duplicate-hooks.md
[no-expect-resolves]: docs/rules/no-expect-resolves.md
[no-export]: docs/rules/no-export.md
[no-focused-tests]: docs/rules/no-focused-tests.md
[no-hooks]: docs/rules/no-hooks.md
[no-identical-title]: docs/rules/no-identical-title.md
[no-if]: docs/rules/no-if.md
[no-jasmine-globals]: docs/rules/no-jasmine-globals.md
[no-jest-import]: docs/rules/no-jest-import.md
[no-large-snapshots]: docs/rules/no-large-snapshots.md
[no-mocks-import]: docs/rules/no-mocks-import.md
[no-standalone-expect]: docs/rules/no-standalone-expect.md
[no-test-callback]: docs/rules/no-test-callback.md
[no-test-prefixes]: docs/rules/no-test-prefixes.md
[no-test-return-statement]: docs/rules/no-test-return-statement.md
[no-truthy-falsy]: docs/rules/no-truthy-falsy.md
[no-try-expect]: docs/rules/no-try-expect.md
[prefer-called-with]: docs/rules/prefer-called-with.md
[prefer-expect-assertions]: docs/rules/prefer-expect-assertions.md
[prefer-inline-snapshots]: docs/rules/prefer-inline-snapshots.md
[prefer-hooks-on-top]: docs/rules/prefer-hooks-on-top.md
[prefer-spy-on]: docs/rules/prefer-spy-on.md
[prefer-strict-equal]: docs/rules/prefer-strict-equal.md
[prefer-to-be-null]: docs/rules/prefer-to-be-null.md
[prefer-to-be-undefined]: docs/rules/prefer-to-be-undefined.md
[prefer-to-contain]: docs/rules/prefer-to-contain.md
[prefer-to-have-length]: docs/rules/prefer-to-have-length.md
[prefer-todo]: docs/rules/prefer-todo.md
[require-top-level-describe]: docs/rules/require-top-level-describe.md
[require-to-throw-message]: docs/rules/require-to-throw-message.md
[valid-describe]: docs/rules/valid-describe.md
[valid-expect-in-promise]: docs/rules/valid-expect-in-promise.md
[valid-expect]: docs/rules/valid-expect.md
[valid-title]: docs/rules/valid-title.md
[fixable-green]: https://img.shields.io/badge/-fixable-green.svg
[fixable-yellow]: https://img.shields.io/badge/-fixable-yellow.svg
[recommended]: https://img.shields.io/badge/-recommended-lightgrey.svg
[style]: https://img.shields.io/badge/-style-blue.svg
