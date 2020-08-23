#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> [conventional-changelog](https://github.com/ajoslin/conventional-changelog) [eslint](https://github.com/eslint/eslint) preset

**Issues with the convention itself should be reported on the ESLint issue tracker.**

## ESLint Convention

Our commit message format is as follows:

```
Tag: Short description (fixes #1234)

Longer description here if necessary
```

The first line of the commit message (the summary) must have a specific format. This format is checked by our build tools.

The `Tag` is one of the following:

* `Fix` - for a bug fix.
* `Update` - either for a backwards-compatible enhancement or for a rule change that adds reported problems.
* `New` - implemented a new feature.
* `Breaking` - for a backwards-incompatible enhancement or feature.
* `Docs` - changes to documentation only.
* `Build` - changes to build process only.
* `Upgrade` - for a dependency upgrade.
* `Chore` - for refactoring, adding tests, etc. (anything that isn't user-facing).

Use the [labels of the issue you are working on](working-on-issues.md#issue-labels) to determine the best tag.

The message summary should be a one-sentence description of the change, and it must be 72 characters in length or shorter. If the pull request addresses an issue, then the issue number should be mentioned at the end. If the commit doesn't completely fix the issue, then use `(refs #1234)` instead of `(fixes #1234)`.

Here are some good commit message summary examples:

```
Build: Update Travis to only test Node 0.10 (refs #734)
Fix: Semi rule incorrectly flagging extra semicolon (fixes #840)
Upgrade: Esprima to 1.2, switch to using comment attachment (fixes #730)
```

The commit message format is important because these messages are used to create a changelog for each release. The tag and issue number help to create more consistent and useful changelogs.

Based on https://eslint.org/docs/developer-guide/contributing/pull-requests#step2

[npm-image]: https://badge.fury.io/js/conventional-changelog-eslint.svg
[npm-url]: https://npmjs.org/package/conventional-changelog-eslint
[travis-image]: https://travis-ci.org/stevemao/conventional-changelog-eslint.svg?branch=master
[travis-url]: https://travis-ci.org/stevemao/conventional-changelog-eslint
[daviddm-image]: https://david-dm.org/stevemao/conventional-changelog-eslint.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stevemao/conventional-changelog-eslint
[coveralls-image]: https://coveralls.io/repos/stevemao/conventional-changelog-eslint/badge.svg
[coveralls-url]: https://coveralls.io/r/stevemao/conventional-changelog-eslint
