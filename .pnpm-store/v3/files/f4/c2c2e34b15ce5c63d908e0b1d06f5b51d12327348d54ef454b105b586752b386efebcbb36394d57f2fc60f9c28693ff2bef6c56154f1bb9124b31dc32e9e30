#  [![NPM version][npm-image]][npm-url] [![Build Status: Linux][travis-image]][travis-url] [![Build Status: Windows][appveyor-image]][appveyor-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) core

You are probably looking for the [cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli) module. Or use one of the plugins if you are already using the tool:  [grunt](https://github.com/btford/grunt-conventional-changelog)/[gulp](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/gulp-conventional-changelog)/[atom](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-atom).

## Usage

```sh
$ npm install --save conventional-changelog-core
```

```js
var conventionalChangelogCore = require('conventional-changelog-core');

conventionalChangelogCore()
  .pipe(process.stdout); // or any writable stream
```

## API

### conventionalChangelogCore([options, [context, [gitRawCommitsOpts, [parserOpts, [writerOpts]]]]])

Returns a readable stream.

*Note:* [`options.transform`](#transform-1), [`options.pkg.transform`](#transform) and [`writerOpts.transform`](https://github.com/conventional-changelog/conventional-changelog-writer#transform) are different. If you have a better naming suggestion, please send a PR.

#### options

##### config

Type: `promise`, `function` or `object`

This should serve as default values for other arguments of `conventionalChangelogCore` so you don't need to rewrite the same or similar config across your projects. Any value in this could be overwritten.
If this is a promise (recommended if async), it should resolve with the config.
If this is a function, it expects a node style callback with the config object.
If this is an object, it is the config object. The config object should include `context`, `gitRawCommitsOpts`, `parserOpts` and `writerOpts`.

##### pkg

Type: `object`

###### path

Type: `string` Default: [closest package.json](https://github.com/sindresorhus/read-pkg-up).

The location of your "package.json".

###### transform

Type: `function` Default: pass through.

A function that takes `package.json` data as the argument and returns the modified data. Note this is performed before normalizing package.json data. Useful when you need to add a leading 'v' to your version or modify your repository url, etc.

##### append

Type: `boolean` Default: `false`

Should the log be appended to existing data.

##### releaseCount

Type: `number` Default: `1`

How many releases of changelog you want to generate. It counts from the upcoming release. Useful when you forgot to generate any previous changelog. Set to `0` to regenerate all.

##### debug

Type: `function` Default: `function() {}`

A debug function. EG: `console.debug.bind(console)`

##### warn

Type: `function` Default: `options.debug`

A warn function. EG: `grunt.verbose.writeln`

##### transform

Type: `function` Default: get the version (without leading 'v') from tag and format date.

###### function(commit, cb)

A transform function that applies after the parser and before the writer.

This is the place to modify the parsed commits.

####### commit

The commit from conventional-commits-parser.

####### cb

Callback when you are done.

####### this

`this` arg of through2.

##### outputUnreleased

Type: `boolean` Default: `true` if a different version than last release is given. Otherwise `false`.

If this value is `true` and `context.version` equals last release then `context.version` will be changed to `'Unreleased'`.

**NOTE:** You may want to combine this option with `releaseCount` set to `0` to always overwrite the whole CHANGELOG. `conventional-changelog` only outputs a CHANGELOG but doesn't read any existing one.

##### lernaPackage

Specify a package in lerna-style monorepo that the CHANGELOG should be generated for.

Lerna tags releases in the format `foo-package@1.0.0` and assumes that packages
are stored in the directory structure `./packages/foo-package`.

##### tagPrefix

Specify a prefix for the git tag that will be taken into account during the comparison.
For instance if your version tag is prefixed by `version/` instead of `v` you would specify `--tagPrefix=version/`

#### context

See the [conventional-changelog-writer](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer) docs. There are some defaults or changes:

##### host

Default: normalized host found in `package.json`.

##### version

Default: version found in `package.json`.

##### owner

Default: extracted from normalized `package.json` `repository.url` field.

##### repository

Default: extracted from normalized `package.json` `repository.url` field.

##### repoUrl

Default: The whole normalized repository url in `package.json`.

##### gitSemverTags

Type: `array`

All git semver tags found in the repository. You can't overwrite this value.

##### previousTag

Type: `string` Default: previous semver tag or the first commit hash if no previous tag.

##### currentTag

Type: `string` Default: current semver tag or `'v'` + version if no current tag.

##### packageData

Type: `object`

Your `package.json` data. You can't overwrite this value.

##### linkCompare

Type: `boolean` Default: `true` if `previousTag` and `currentTag` are truthy.

Should link to the page that compares current tag with previous tag?

#### gitRawCommitsOpts

See the [git-raw-commits](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/git-raw-commits) docs. There are some defaults:

##### format

Default: `'%B%n-hash-%n%H%n-gitTags-%n%d%n-committerDate-%n%ci'`

##### from

Default: based on `options.releaseCount`.

##### reverse

Default: `true` if `options.append` is truthy.

##### debug

Type: `function` Default: `options.debug`

#### parserOpts

See the [conventional-commits-parser](https://github.com/conventional-changelog/conventional-commits-parser) docs.

##### warn

Default: `options.warn`

#### writerOpts

See the [conventional-changelog-writer](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer) docs. There are some defaults:

##### finalizeContext

Finalize context is used for generating above context.

**NOTE:** If you overwrite this value the above context defaults will be gone.

##### debug

Type: `function` Default: `options.debug`

##### reverse

Default: `options.append`

##### doFlush

Default: `options.outputUnreleased`


## Notes for parent modules

This module has options `append` and `releaseCount`. However, it doesn't read your previous changelog. Reasons being:

1. The old logs is just to be appended or prepended to the newly generated logs, which is a very simple thing that could be done in the parent module.
2. We want it to be very flexible for the parent module. You could create a readable stream from the file or you could just read the file.
3. We want the duty of this module to be very minimum.

So, when you build a parent module, you need to read the old logs and append or prepend to them based on `options.append`. However, if `options.releaseCount` is `0` you need to ignore any previous logs. Please see [conventional-github-releaser](https://github.com/conventional-changelog/conventional-github-releaser) as an example.

Arguments passed to `conventionalChangelogCore` will be mutated.


## License

MIT


[npm-image]: https://badge.fury.io/js/conventional-changelog-core.svg
[npm-url]: https://npmjs.org/package/conventional-changelog-core
[travis-image]: https://travis-ci.org/conventional-changelog/conventional-changelog-core.svg?branch=master
[travis-url]: https://travis-ci.org/conventional-changelog/conventional-changelog-core
[appveyor-image]: https://ci.appveyor.com/api/projects/status/baoumm34w8c5o0hv/branch/master?svg=true
[appveyor-url]: https://ci.appveyor.com/project/stevemao/conventional-changelog-core/branch/master
[daviddm-image]: https://david-dm.org/conventional-changelog/conventional-changelog-core.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/conventional-changelog/conventional-changelog-core
[coveralls-image]: https://coveralls.io/repos/conventional-changelog/conventional-changelog-core/badge.svg
[coveralls-url]: https://coveralls.io/r/conventional-changelog/conventional-changelog-core
