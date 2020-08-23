# 🚫💩 lint-staged [![Build Status for Linux](https://travis-ci.org/okonet/lint-staged.svg?branch=master)](https://travis-ci.org/okonet/lint-staged) [![Build Status for Windows](https://ci.appveyor.com/api/projects/status/github/okonet/lint-staged?branch=master&svg=true)](https://ci.appveyor.com/project/okonet/lint-staged) [![npm version](https://badge.fury.io/js/lint-staged.svg)](https://badge.fury.io/js/lint-staged) [![Codecov](https://codecov.io/gh/okonet/lint-staged/branch/master/graph/badge.svg)](https://codecov.io/gh/okonet/lint-staged)

Run linters against staged git files and don't let :poop: slip into your code base!

[![asciicast](https://asciinema.org/a/199934.svg)](https://asciinema.org/a/199934)

## Why

Linting makes more sense when run before committing your code. By doing so you can ensure no errors go into the repository and enforce code style. But running a lint process on a whole project is slow and linting results can be irrelevant. Ultimately you only want to lint files that will be committed.

This project contains a script that will run arbitrary shell tasks with a list of staged files as an argument, filtered by a specified glob pattern.

## Related blogs posts and talks

* [Make Linting Great Again](https://medium.com/@okonetchnikov/make-linting-great-again-f3890e1ad6b8#.8qepn2b5l)
* [Running Jest Tests Before Each Git Commit](https://benmccormick.org/2017/02/26/running-jest-tests-before-each-git-commit/)
* [AgentConf: Make Linting Great Again](https://www.youtube.com/watch?v=-mhY7e-EsC4)
* [SurviveJS Interview](https://survivejs.com/blog/lint-staged-interview/)

> If you've written one, please submit a PR with the link to it!

## Installation and setup

The fastest way to start using lint-staged is to run following command in your terminal:

```bash
npx mrm lint-staged
```

It will install and configure [husky](https://github.com/typicode/husky) and lint-staged depending on code quality tools from `package.json` dependencies so please make sure you install (`npm install --save-dev`) and configure all code quality tools like [Prettier](https://prettier.io), [ESlint](https://eslint.org) prior that.

Don't forget to commit changes to `package.json` to share this setup with your team!

Now change a few files, `git add` or `git add --patch` some of them to your commit and try to `git commit` them.

See [examples](#examples) and [configuration](#configuration) for more information.

## Changelog

See [Releases](https://github.com/okonet/lint-staged/releases)

## Command line flags

```
$ ./node_modules/.bin/lint-staged --help

  Usage: lint-staged [options]


  Options:

    -V, --version        output the version number
    -c, --config [path]  Configuration file path or package
    -d, --debug          Enable debug mode
    -h, --help           output usage information
```

* **`--config [path]`**: This can be used to manually specify the `lint-staged` config file location. However, if the specified file cannot be found, it will error out instead of performing the usual search. You may pass a npm package name for configuration also.
* **`--debug`**: Enabling the debug mode does the following:
  * `lint-staged` uses the [debug](https://github.com/visionmedia/debug) module internally to log information about staged files, commands being executed, location of binaries, etc. Debug logs, which are automatically enabled by passing the flag, can also be enabled by setting the environment variable `$DEBUG` to `lint-staged*`.
  * Use the [`verbose` renderer](https://github.com/SamVerschueren/listr-verbose-renderer) for `listr`.
  * Do not pass `--silent` to npm scripts.

## Configuration

Starting with v3.1 you can now use different ways of configuring it:

* `lint-staged` object in your `package.json`
* `.lintstagedrc` file in JSON or YML format
* `lint-staged.config.js` file in JS format
* Pass a configuration file using the `--config` or `-c` flag

See [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for more details on what formats are supported.

Lint-staged supports simple and advanced config formats.

### Simple config format

Should be an object where each value is a command to run and its key is a glob pattern to use for this command. This package uses [micromatch](https://github.com/micromatch/micromatch) for glob patterns.

#### `package.json` example:

```json
{
  "lint-staged": {
    "*": "your-cmd"
  }
}
```

#### `.lintstagedrc` example

```json
{
  "*": "your-cmd"
}
```

This config will execute `your-cmd` with the list of currently staged files passed as arguments.

So, considering you did `git add file1.ext file2.ext`, lint-staged will run the following command:

`your-cmd file1.ext file2.ext`

### Advanced config format

To extend and customise lint-staged, advanced options are available. To use these options the format should be as the following:

#### `package.json` example with `ignore` option:

```json
{
  "lint-staged": {
    "linters": {
      "*.{js,scss}": ["some command", "git add"]
    },
    "ignore": ["**/dist/*.min.js"]
  }
}
```

Notice that the linting commands now are nested into the `linters` object. The following options are available for advanced configuration:

#### Options

* `concurrent` — _true_ — runs linters for each glob pattern simultaneously. If you don’t want this, you can set `concurrent: false`
* `chunkSize` — Max allowed chunk size based on number of files for glob pattern. This option is only applicable on Windows based systems to avoid command length limitations. See [#147](https://github.com/okonet/lint-staged/issues/147)
* `globOptions` — `{ matchBase: true, dot: true }` — [micromatch options](https://github.com/micromatch/micromatch#options) to
  customize how glob patterns match files.
* `ignore` - `['**/docs/**/*.js']` - array of glob patterns to entirely ignore from any task.
* `linters` — `Object` — keys (`String`) are glob patterns, values (`Array<String> | String`) are commands to execute.
* `subTaskConcurrency` — `1` — Controls concurrency for processing chunks generated for each linter. This option is only applicable on Windows. Execution is **not** concurrent by default(see [#225](https://github.com/okonet/lint-staged/issues/225))
* `relative` — `false` — if `true` it will give the relative path from your `package.json` directory to your linter arguments.

## Filtering files

It is possible to run linters for certain paths only by using glob patterns. [micromatch](https://github.com/micromatch/micromatch) is used to filter the staged files according to these patterns. File patterns should be specified _relative to the `package.json` location_ (i.e. where `lint-staged` is installed).

**NOTE:** If you're using `lint-staged<5` globs have to be _relative to the git root_.

```js
{
  // .js files anywhere in the root directory of the project
  "*.js": "eslint",
  // .js files anywhere in the project
  "**/*.js": "eslint",
  // .js file in the src directory
  "src/*.js": "eslint",
  // .js file anywhere within and below the src directory
  "src/**/*.js": "eslint",
}
```

When matching, `lint-staged` will do the following

* Resolve the git root automatically, no configuration needed.
* Pick the staged files which are present inside the project directory.
* Filter them using the specified glob patterns.
* Pass absolute paths to the linters as arguments.

**NOTE:** `lint-staged` will pass _absolute_ paths to the linters to avoid any confusion in case they're executed in a different working directory (i.e. when your `.git` directory isn't the same as your `package.json` directory).

Also see [How to use `lint-staged` in a multi package monorepo?](#how-to-use-lint-staged-in-a-multi-package-monorepo)

## What commands are supported?

Supported are any executables installed locally or globally via `npm` as well as any executable from your $PATH.

> Using globally installed scripts is discouraged, since lint-staged may not work for someone who doesn’t have it installed.

`lint-staged` is using [npm-which](https://github.com/timoxley/npm-which) to locate locally installed scripts. So in your `.lintstagedrc` you can write:

```json
{
  "*.js": "eslint --fix"
}
```

Pass arguments to your commands separated by space as you would do in the shell. See [examples](#examples) below.

Starting from [v2.0.0](https://github.com/okonet/lint-staged/releases/tag/2.0.0) sequences of commands are supported. Pass an array of commands instead of a single one and they will run sequentially. This is useful for running autoformatting tools like `eslint --fix` or `stylefmt` but can be used for any arbitrary sequences.

## Reformatting the code

Tools like [Prettier](https://prettier.io), ESLint/TSLint, or stylelint can reformat your code according to an appropriate config by running `prettier --write`/`eslint --fix`/`tslint --fix`/`stylelint --fix`. After the code is reformatted, we want it to be added to the same commit. This can be done using following config:

```json
{
  "*.js": ["prettier --write", "git add"]
}
```

Starting from v8, lint-staged will stash your remaining changes (not added to the index) and restore them from stash afterwards if there are partially staged files detected. This allows you to create partial commits with hunks using `git add --patch`. See the [blog post](https://medium.com/@okonetchnikov/announcing-lint-staged-with-support-for-partially-staged-files-abc24a40d3ff)

## Examples

All examples assuming you’ve already set up lint-staged and husky in the `package.json`.

```json
{
  "name": "My project",
  "version": "0.1.0",
  "scripts": {
    "my-custom-script": "linter --arg1 --arg2"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {}
}
```

_Note we don’t pass a path as an argument for the runners. This is important since lint-staged will do this for you._

### ESLint with default parameters for `*.js` and `*.jsx` running as a pre-commit hook

```json
{
  "*.{js,jsx}": "eslint"
}
```

### Automatically fix code style with `--fix` and add to commit

```json
{
  "*.js": ["eslint --fix", "git add"]
}
```

This will run `eslint --fix` and automatically add changes to the commit.

### Reuse npm script

If you wish to reuse a npm script defined in your package.json:

```json
{
  "*.js": ["npm run my-custom-script --", "git add"]
}
```

The following is equivalent:

```json
{
  "*.js": ["linter --arg1 --arg2", "git add"]
}
```

### Use environment variables with linting commands

Linting commands _do not_ support the shell convention of expanding environment variables. To enable the convention yourself, use a tool like [`cross-env`](https://github.com/kentcdodds/cross-env).

For example, here is `jest` running on all `.js` files with the `NODE_ENV` variable being set to `"test"`:

```json
{
  "*.js": ["cross-env NODE_ENV=test jest --bail --findRelatedTests"]
}
```

### Automatically fix code style with `prettier` for javascript + flow, typescript, markdown or html

```json
{
  "*.{js,jsx}": ["prettier --write", "git add"]
}
```

```json
{
  "*.{ts,tsx}": ["prettier --write", "git add"]
}
```

```json
{
  "*.{md,html}": ["prettier --write", "git add"]
}
```

### Use ng lint with angular cli >= 7.0.0

```json
{
  "linters": {
    "*.ts": "ng lint myProjectName --files"
  },
  "relative": true
}
```

### Stylelint for CSS with defaults and for SCSS with SCSS syntax

```json
{
  "*.css": "stylelint",
  "*.scss": "stylelint --syntax=scss"
}
```

### Run PostCSS sorting, add files to commit and run Stylelint to check

```json
{
  "*.scss": ["postcss --config path/to/your/config --replace", "stylelint", "git add"]
}
```

### Minify the images and add files to commit

```json
{
  "*.{png,jpeg,jpg,gif,svg}": ["imagemin-lint-staged", "git add"]
}
```

<details>
  <summary>More about <code>imagemin-lint-staged</code></summary>

[imagemin-lint-staged](https://github.com/tomchentw/imagemin-lint-staged) is a CLI tool designed for lint-staged usage with sensible defaults.

See more on [this blog post](https://medium.com/@tomchentw/imagemin-lint-staged-in-place-minify-the-images-before-adding-to-the-git-repo-5acda0b4c57e) for benefits of this approach.

</details>

### Typecheck your staged files with flow

```json
{
  "*.{js,jsx}": ["flow focus-check", "git add"]
}
```

## Frequently Asked Questions

### Using with JetBrains IDEs _(WebStorm, PyCharm, IntelliJ IDEA, RubyMine, etc.)_

_**Update**_: The latest version of JetBrains IDEs now support running hooks as you would expect.

When using the IDE's GUI to commit changes with the `precommit` hook, you might see inconsistencies in the IDE and command line. This is [known issue](https://youtrack.jetbrains.com/issue/IDEA-135454) at JetBrains so if you want this fixed, please vote for it on YouTrack.

Until the issue is resolved in the IDE, you can use the following config to work around it:

husky v1.x

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "post-commit": "git update-index --again"
    }
  }
}
```

husky v0.x

```json
{
  "scripts": {
    "precommit": "lint-staged",
    "postcommit": "git update-index --again"
  }
}
```

_Thanks to [this comment](https://youtrack.jetbrains.com/issue/IDEA-135454#comment=27-2710654) for the fix!_

### How to use `lint-staged` in a multi package monorepo?

Starting with v5.0, `lint-staged` automatically resolves the git root **without any** additional configuration. You configure `lint-staged` as you normally would if your project root and git root were the same directory.

If you wish to use `lint-staged` in a multi package monorepo, it is recommended to install [`husky`](https://github.com/typicode/husky) in the root package.json.
[`lerna`](https://github.com/lerna/lerna) can be used to execute the `precommit` script in all sub-packages.

Example repo: [sudo-suhas/lint-staged-multi-pkg](https://github.com/sudo-suhas/lint-staged-multi-pkg).

### Can I lint files outside of the current project folder?

tl;dr: Yes, but the pattern should start with `../`.

By default, `lint-staged` executes linters only on the files present inside the project folder(where `lint-staged` is installed and run from).
So this question is relevant _only_ when the project folder is a child folder inside the git repo.
In certain project setups, it might be desirable to bypass this restriction. See [#425](https://github.com/okonet/lint-staged/issues/425), [#487](https://github.com/okonet/lint-staged/issues/487) for more context.

`lint-staged` provides an escape hatch for the same(`>= v7.3.0`). For patterns that start with `../`, all the staged files are allowed to match against the pattern.
Note that patterns like `*.js`, `**/*.js` will still only match the project files and not any of the files in parent or sibling directories.

Example repo: [sudo-suhas/lint-staged-django-react-demo](https://github.com/sudo-suhas/lint-staged-django-react-demo).
