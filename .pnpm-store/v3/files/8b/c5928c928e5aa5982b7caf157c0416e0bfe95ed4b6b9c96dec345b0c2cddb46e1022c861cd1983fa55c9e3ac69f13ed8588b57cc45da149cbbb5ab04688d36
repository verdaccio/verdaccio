# conventional-recommended-bump

> Get a recommended version bump based on conventional commits.

Got the idea from https://github.com/conventional-changelog/conventional-changelog/pull/29

## Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Usage](#usage)
- [API](#api)
    - [options](#options)
      - [ignoreReverted](#ignorereverted)
      - [preset](#preset)
      - [config](#config)
      - [whatBump](#whatbump)
      - [tagPrefix](#tagprefix)
      - [lernaPackage](#lernapackage)
    - [parserOpts](#parseropts)
    - [callback](#callback)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
npm install conventional-recommended-bump
```

## Usage

```javascript
const conventionalRecommendedBump = require(`conventional-recommended-bump`);

conventionalRecommendedBump({
  preset: `angular`
}, (error, recommendation) => {
  console.log(recommendation.releaseType); // 'major'
});
```

```bash
npm install --global conventional-recommended-bump
conventional-recommended-bump --help
```

## API

```javascript
conventionalRecommendedBump(options, [parserOpts,] callback);
```

`parserOpts` is optional.

In the case you don't want to provide `parserOpts`, then `callback` must be provided as the second argument.

#### options

`options` is an object with the following properties:

* ignoreReverted
* preset
* config
* whatBump

##### ignoreReverted

**Type:** `boolean` **Default:** `true`

If `true`, reverted commits will be ignored.

##### preset

**Type:** `string`

It's recommended to use a preset so you don't have to define everything yourself.

The value is passed to [`conventional-changelog-preset-loader`](https://www.npmjs.com/package/conventional-changelog-preset-loader).

##### config

**Type:** `object`

This should serve as default values for other arguments of `conventional-recommended-bump` so you don't need to rewrite the same or similar config across your projects.

**NOTE:** `config` option will be overwritten by the value loaded by `conventional-changelog-preset-loader` if the `preset` options is set.

##### whatBump

**Type:** `function`

A function that takes parsed commits as an argument.

```javascript
whatBump(commits) {};
```

`commits` is an array of all commits from last semver tag to `HEAD` as parsed by [conventional-commits-parser](https://github.com/conventional-changelog/conventional-commits-parser)

This should return an object including but not limited to `level` and `reason`. `level` is a `number` indicating what bump it should be and `reason` is the reason of such release.

##### tagPrefix

**Type:** `string`

Specify a prefix for the git tag that will be taken into account during the comparison.

For instance if your version tag is prefixed by `version/` instead of `v` you would specifying `--tagPrefix=version/` using the CLI, or `version/` as the value of the `tagPrefix` option.

##### lernaPackage

**Type:** `string`

Specify the name of a package in a [Lerna](https://lernajs.io/)-managed repository. The package name will be used when fetching all changes to a package since the last time that package was released.

For instance if your project contained a package named `conventional-changelog`, you could have only commits that have happened since the last release of `conventional-changelog` was tagged by specifying `--lernaPackage=conventional-changelog` using the CLI, or `conventional-changelog` as the value of the `lernaPackage` option.

#### parserOpts

**Type:** `object`

See the [conventional-commits-parser](https://github.com/conventional-changelog/conventional-commits-parser) documentation for available options.

#### callback

**Type:** `function`

```javascript
callback(error, recommendation) {};
```

`recommendation` is an `object` with a single property, `releaseType`.

`releaseType` is a `string`: Possible values: `major`, `minor` and `patch`, or `undefined` if `whatBump` does not return sa valid `level` property, or the `level` property is not set by `whatBump`.

## Debugging

To assist users of `conventional-recommended-bump` with debugging the behavior of this module we use the [debug](https://www.npmjs.com/package/debug) utility package to print information about the release process to the console. To enable debug message printing, the environment variable `DEBUG`, which is the variable used by the `debug` package, must be set to a value configured by the package containing the debug messages to be printed.

To print debug messages on a unix system set the environment variable `DEBUG` with the name of this package prior to executing `conventional-recommended-bump`:

```bash
DEBUG=conventional-recommended-bump conventional-recommended-bump
```

On the Windows command line you may do:

```bash
set DEBUG=conventional-recommended-bump
conventional-recommended-bump
```

## Node Support Policy

We only support [Long-Term Support](https://github.com/nodejs/Release) versions of Node.

We specifically limit our support to LTS versions of Node, not because this package won't work on other versions, but because we have a limited amount of time, and supporting LTS offers the greatest return on that investment.

It's possible this package will work correctly on newer versions of Node. It may even be possible to use this package on older versions of Node, though that's more unlikely as we'll make every effort to take advantage of features available in the oldest LTS version we support.

As each Node LTS version reaches its end-of-life we will remove that version from the `node` `engines` property of our package's `package.json` file. Removing a Node version is considered a breaking change and will entail the publishing of a new major version of this package. We will not accept any requests to support an end-of-life version of Node. Any merge requests or issues supporting an end-of-life version of Node will be closed.

We will accept code that allows this package to run on newer, non-LTS, versions of Node. Furthermore, we will attempt to ensure our own changes work on the latest version of Node. To help in that commitment, our continuous integration setup runs against all LTS versions of Node in addition the most recent Node release; called _current_.

JavaScript package managers should allow you to install this package with any version of Node, with, at most, a warning if your version of Node does not fall within the range specified by our `node` `engines` property. If you encounter issues installing this package, please report the issue to your package manager.

## Contributing

Please read our [contributing guide](https://github.com/conventional-changelog/conventional-changelog/blob/master/CONTRIBUTING.md) to see how you may contribute to this project.

## License

MIT © [Steve Mao](https://github.com/stevemao)
