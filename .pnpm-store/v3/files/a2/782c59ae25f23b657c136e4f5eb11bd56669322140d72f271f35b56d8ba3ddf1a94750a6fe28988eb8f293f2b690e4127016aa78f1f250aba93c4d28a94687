#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Get all git semver tags of your repository in reverse chronological order

*Note:* since lightweight tags do not store date information, the date of a tag is the date of the commit that is tagged on. If two tags on one commit, the order is not guaranteed.


## Install

```sh
$ npm install --save git-semver-tags
```

## Usage

```js
var gitSemverTags = require('git-semver-tags');

// gitSemverTags([options,] callback)

gitSemverTags(function(err, tags) {
  console.log(tags);
  //=> [ 'v2.0.0', 'v1.0.0' ]
});
```

```sh
$ npm install --global git-semver-tags
$ git-semver-tags
v2.0.0
v1.0.0
```

## Options

* `opts.lernaTags`: extract lerna style tags (`foo-package@2.0.0`) from the
  git history, rather than `v1.0.0` format.
* `opts.package`: what package should lerna style tags be listed for, e.g.,
  `foo-package`.
* `opts.tagPrefix`: specify a prefix for the git tag to be ignored from the semver checks

## License

MIT © [Steve Mao](https://github.com/stevemao)


[npm-image]: https://badge.fury.io/js/git-semver-tags.svg
[npm-url]: https://npmjs.org/package/git-semver-tags
[travis-image]: https://travis-ci.org/conventional-changelog/git-semver-tags.svg?branch=master
[travis-url]: https://travis-ci.org/conventional-changelog/git-semver-tags
[daviddm-image]: https://david-dm.org/stevemao/git-semver-tags.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stevemao/git-semver-tags
[coveralls-image]: https://coveralls.io/repos/stevemao/git-semver-tags/badge.svg
[coveralls-url]: https://coveralls.io/r/stevemao/git-semver-tags
