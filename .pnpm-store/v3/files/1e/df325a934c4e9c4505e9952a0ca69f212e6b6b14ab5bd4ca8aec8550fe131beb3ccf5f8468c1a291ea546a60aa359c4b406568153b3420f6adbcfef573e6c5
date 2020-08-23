#  [![NPM version][npm-image]][npm-url] [![Build Status: Linux][travis-image]][travis-url] [![Build Status: Windows][appveyor-image]][appveyor-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Get raw git commits out of your repository using git-log(1)


## Install

```sh
$ npm install --save git-raw-commits
```


## Usage

```js
var gitRawCommits = require('git-raw-commits');

gitRawCommits(options)
  .pipe(...);
```


## API

### gitRawCommits(gitOpts, [execOpts])

Returns a readable stream. Stream is split to break on each commit.

#### gitOpts

Type: `object`

Please check the available options at http://git-scm.com/docs/git-log.
**NOTE:** Single dash arguments are not supported because of https://github.com/sindresorhus/dargs/blob/master/index.js#L5.

*NOTE*: for `<revision range>` we can also use `<from>..<to>` pattern, and this module has the following extra options for shortcut of this pattern:

##### gitOpts.from

Type: `string` Default: `''`

##### gitOpts.to

Type: `string` Default: `'HEAD'`

This module also have the following additions:

##### gitOpts.format

Type: `string` Default: `'%B'`

Please check http://git-scm.com/docs/git-log for format options.

##### gitOpts.debug

Type: `function`

A function to get debug information.

##### gitOpts.path

Type: `string`

Filter commits to the path provided.

##### execOpts

Options to pass to `git` `childProcess`

Type: `object`

##### execOpts.cwd

Type: `string`

Current working directory to execute git in


## CLI

```sh
$ npm install --global git-raw-commits
$ git-raw-commits --help # for more details
```


## License

MIT © [Steve Mao](https://github.com/stevemao)


[npm-image]: https://badge.fury.io/js/git-raw-commits.svg
[npm-url]: https://npmjs.org/package/git-raw-commits
[travis-image]: https://travis-ci.org/conventional-changelog/git-raw-commits.svg?branch=master
[travis-url]: https://travis-ci.org/conventional-changelog/git-raw-commits
[appveyor-image]: https://ci.appveyor.com/api/projects/status/4qm3bjmg41k3dsbv/branch/master?svg=true
[appveyor-url]: https://ci.appveyor.com/project/stevemao/git-raw-commits/branch/master
[daviddm-image]: https://david-dm.org/conventional-changelog/git-raw-commits.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/conventional-changelog/git-raw-commits
[coveralls-image]: https://coveralls.io/repos/conventional-changelog/git-raw-commits/badge.svg
[coveralls-url]: https://coveralls.io/r/conventional-changelog/git-raw-commits
