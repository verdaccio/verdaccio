# Contributing

> This guidelines refers to the main (`master`) that host the v6.x, if you want to contribute to `5.x` please read the following [link](https://github.com/verdaccio/verdaccio/blob/5.x/CONTRIBUTING.md).

We're happy that you're considering contributing!

To help you getting started we've prepared these guidelines for you, any change matter, just do it:

## How Do I Contribute?

There are many ways to contribute:

- [Report a bug](#reporting-bugs)
- [Request a feature you think would be great for Verdaccio](#feature-request)
- [Fixing bugs](https://github.com/verdaccio/verdaccio/issues?q=is%3Aopen+is%3Aissue+label%3A%22issue%3A+bug%22)
- [Test and triage bugs reported by others](https://github.com/verdaccio/verdaccio/issues?q=is%3Aopen+is%3Aissue+label%3Aissue_needs_triage)
- [Working on requested/approved features](https://github.com/verdaccio/verdaccio/issues?q=is%3Aopen+is%3Aissue+label%3A%22topic%3A+feature+request%22+)
- [Improve the codebase (linting, naming, comments, test descriptions, etc...)](https://github.com/verdaccio/verdaccio/discussions/1461)
- Improve code coverage for unit testing for every module, [end to end](https://github.com/verdaccio/verdaccio/tree/master/e2e/cli) or [UI test](https://github.com/verdaccio/verdaccio/tree/master/e2e/ui) (with cypress).

The Verdaccio project is split into several areas, the first three hosted in the main repository:

- **Core**: The [core](https://github.com/verdaccio/verdaccio) is the main repository, built with **Node.js**.
- **Website**: we use [**Docusaurus**](https://docusaurus.io/) for the **website** and if you are familiar with this technology, you might become the official webmaster.
- **User Interface**: The [user Interface](https://github.com/verdaccio/ui) is based in **react** and **material-ui** and looking for front-end contributors.
- **Kubernetes and Helm**: Ts the official repository for the [**Helm chart**](https://github.com/verdaccio/charts).

> There are other areas to contribute, like [documentation](https://github.com/verdaccio/verdaccio/tree/master/website/docs) or [translations](#translations}).

## Prepare local setup {#local-setup}

**Note**: The size of the Verdaccio project is quite significant. Unzipped it is about 33 MB. However, a full build with all node_modules installed takes about **2.8 GB** of disk space (~190k files)!

Verdaccio uses [pnpm](https://pnpm.io) as the package manager for development in this repository.

If you are using pnpm for the first time the [pnpm configuration documentation](https://pnpm.io/configuring) may be useful to avoid any potential problems with the following steps.

**Note**: pnpm uses npm's configuration formats so check that your global `.npmrc` file does not inadvertently disable package locks. In other words, your `.npmrc` file **should not** contain

```
package-lock=false
```

This setting would cause the `pnpm install` command to install incorrect versions of package dependencies and the subsequent `pnpm build` step would likely fail.

We use [corepack](https://github.com/nodejs/corepack) to install and use a specific (latest) version of pnpm. Please run the following commands which is use a specific version on Node.js and configure it to use a specific version of pnpm. The version of pnpm is specified in the `package.json` file in `packageManager` field.

```shell
nvm install
corepack enable
```

`pnpm` version will be updated mainly by the maintainers but if you would like to set it to a specific version, you can do so by running the following command:

> `packageManager` at the `package.json` defines the default version to be used.

```shell
corepack prepare
```

With pnpm installed, the first step is installing all dependencies:

```shell
pnpm install
```

### Building the project

Each package is independent, dependencies must be build first, run:

```shell
pnpm build
```

### Running test

```shell
pnpm test
```

Verdaccio is a mono repository. To run the tests for a specific package:

```shell
cd packages/store
pnpm test
```

or a specific test in that package:

```shell
pnpm test test/merge.dist.tags.spec.ts
```

or a single test unit:

```shell
pnpm test test/merge.dist.tags.spec.ts -- -t 'simple'
```

Coverage reporting is enabled by default, but you can turn it off to speed up
test runs:

```shell
pnpm test test/merge.dist.tags.spec.ts -- -t 'simple' --coverage=false
```

You can enable increased [`debug`](https://www.npmjs.com/package/debug) output:

```shell
DEBUG=verdaccio:* pnpm test
```

More details in the debug section

### Running and debugging

> Check the debugging guidelines [here](https://github.com/verdaccio/verdaccio/wiki/Debugging-Verdaccio)

We use [`debug`](https://www.npmjs.com/package/debug) to add helpful debugging
output to the code. Each package has it owns namespace.

#### Developing with local server

To run the application from the source code, ensure the project has been built with `pnpm build`, once this is done, there are few commands that helps to run server:

The command `pnpm start` runs web server on port `8000` and user interface (webpack-server) on port `4873`. This is particularly useful if you want to contribute to the UI, since it runs with hot reload. The request to the server are proxy through webpack proxy support through the port `4873`.

The user interface is split in two packages, the `/packages/plugins/ui-theme` and the `/packages/ui-components`. The `ui-components` package uses _storybook_ in order to develop component, but if you need to reload ui components with `ui-theme` do the following.

Go to `/packages/ui-component` and run `pnpm watch` to enable _babel_ in watch mode, every change on the components will be hot reloaded in combination with the `pnpm start` command.

Any change on the server packages, must be build independently (server does not have hot reload, `pnpm start` should be triggered again).

Any interaction with the server should be done through the port `8000` eg: `npm login --registry http://localhost:8000` .

#### Useful commands

- `pnpm debug`: Run the server in debug mode `--inspect`. UI runs too but without hot reload. For automatic break use `pnpm debug:break`.
- `pnpm debug:fastify`: To contribute on the [fastify migration](https://github.com/verdaccio/verdaccio/discussions/2155) this is a temporary command for such purpose.
- `pnpm website`: Build the website, for more commands to run the _website_, run `cd website` and then `pnpm serve`, website will run on port `3000`.
- `pnpm docker`: Build the docker image. Requires `docker` command available in your system.

#### Debugging compiled code {#debugging-compiled-code}

Currently, you can only run pre-compiled packages in debug mode. To enable debug
while running add the `verdaccio` namespace using the `DEBUG` environment
variable, like this:

```shell
DEBUG=verdaccio:* node packages/verdaccio/debug/bootstrap.js
```

You can filter this output to just the packages you're interested in using
namespaces:

```shell
DEBUG=verdaccio:plugin:* node packages/verdaccio/debug/bootstrap.js
```

The debug code is intended to analyze what is happening under the hood and none
of the output is sent to the logger module.

> [See the full guide how to debug with Verdaccio](https://github.com/verdaccio/verdaccio/wiki/Debugging-Verdaccio)

#### Testing your changes in a local registry {#testing-local-registry}

Once you have performed your changes in the code base, the build and tests passes you can publish a local version:

- Ensure you have built all modules by running `pnpm build` (or the one you have modified)
- Run `pnpm local:publish:release` to launch a local registry and publish all packages into it. This command will be alive until server is killed (Control Key + C)

```shell
pnpm build
pnpm local:publish:release
```

The last step consist on install globally the package from the local registry which runs on the default port (4873).

```shell
npm i -g verdaccio --registry=http://localhost:4873
verdaccio
```

If you perform more changes in the source code, repeat this process, there is no _hot reloading_ support.

## Feature Request {#feature-request}

New feature requests are welcome. Analyse whether the idea fits within scope of the project. Adding in context and the use-case will really help!

**Please provide:**

- Create a [discussion](https://github.com/verdaccio/verdaccio/discussions/new).
- A detailed description the advantages of your request.
- Whether or not it's compatible with `npm`, `pnpm` and [_yarn classic_
  ](https://github.com/yarnpkg/yarn) or [_yarn modern_
  ](https://github.com/yarnpkg/berry).
- A potential implementation or design
- Whatever else is on your mind! 🤓

## Reporting Bugs {#reporting-bugs}

**Bugs are considered features that are not working as described in
documentation.**

If you've found a bug in Verdaccio **that isn't a security risk**, please file
a report in our [issue tracker](https://github.com/verdaccio/verdaccio/issues), if you think a potential vulnerability please read the [security policy](https://verdaccio.org/community/security) .

> **NOTE: Verdaccio still does not support all npm commands. Some were not
> considered important and others have not been requested yet.**

### What is not considered a bug?

- _Third party integrations_: proxies integrations, external plugins
- _Package managers_: If a package manager does not support a specific command
  or cannot be reproduced with another package manager
- _Features clearly flagged as not supported_
- _Node.js issues installation in any platform_: If you cannot install the
  global package (this is considered external issue)
- Any ticket which has been flagged as an [external issue
  ](https://github.com/verdaccio/verdaccio/labels/external-issue)

If you intend to report a **security** issue, please follow our [Security policy
guidelines](https://github.com/verdaccio/verdaccio/security/policy).

### Issues {#issues}

Before reporting a bug please:

- Search for existing issues to see if it has already been reported
- Look for the **question** label: we have labelled questions for easy follow-up
  as [questions](https://github.com/verdaccio/verdaccio/labels/question)

In case any of those match with your search, up-vote it (using GitHub reactions)
or add additional helpful details to the existing issue to show that it's
affecting multiple people.

### Contributing support

Questions can be asked via [Discord](https://discord.gg/7qWJxBf)

**Please use the `#contribute` channel.**

## Development Guidelines {#development-guidelines}

It's recommended use a UNIX system for local development, Windows dev local support is not being tested and might not work. To ensure a fast code review and merge, please follow the next guidelines:

Any contribution gives you the right to be part of this organization as _collaborator_ and your avatar will be automatically added to the [contributors page](https://verdaccio.org/contributors).

## Pull Request {#pull-request}

### Submitting a Pull Request {#submit-pull-request}

The following are the steps you should follow when creating a pull request.
Subsequent pull requests only need to follow step 3 and beyond.

1. Fork the repository on GitHub
2. Clone the forked repository to your machine
3. Make your changes and commit them to your local repository
4. Rebase and push your commits to your GitHub remote fork/repository
5. Issue a Pull Request to the official repository
6. Your Pull Request is reviewed by a committer and merged into the repository

**NOTE**: While there are other ways to accomplish the steps using other tools,
the examples here will assume most actions will be performed via `git` on
command line.

For more information on maintaining a fork, please see the GitHub Help article
titled [Fork a Repo](https://help.github.com/articles/fork-a-repo/), and
information on [rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing).

### Make Changes and Commit

#### Caveats

Feel free to commit as many times you want in your branch, but keep on mind on
this repository we `git squash` on merge by default, as we like to maintain a
clean git history.

#### Before Push {#before-push}

Before committing or push, **you must ensure there are no linting errors and
all tests passes**. To do verify, run these commands before creating the PR:

```bash
pnpm lint
pnpm format
pnpm build
pnpm test
```

> note: eslint and formatting are run separately, keep code formatting
> before push.

All good? Perfect! You should create the pull request.

#### Commit Guidelines {#commits}

On a pull request, commit messages are not important, please focus on document properly the pull request content. The commit message will be taken from the pull request title, it is recommended to use lowercase format.

### Adding a changeset {#changeset}

We use [changesets](https://github.com/atlassian/changesets) in order to
generate a detailed Changelog as possible.

Adding a changeset with your Pull Request is essential if you want your
contribution to get merged (unless it does not affect functionality or
user-facing content, eg: docs, readme, adding test or typo/lint fixes). To
create a changeset please run:

```shell
pnpm changeset
```

Then select the packages you want to include in your changeset navigating
through them and press the spacebar to check it, on finish press enter to move
to the next step.

```
🦋  Which packages would you like to include? …
✔ changed packages
 changed packages
  ✔ @verdaccio/api
  ✔ @verdaccio/auth
  ✔ @verdaccio/cli
  ✔ @verdaccio/config
  ✔ @verdaccio/commons-api
```

The next question would be if you want a _major bump_. This is not the usual
scenario, most likely you want a patch, and in that case press enter 2 times
(to skip minor)

```
🦋  Which packages should have a major bump? …
✔ all packages
  ✔ @verdaccio/config@5.0.0-alpha.0
```

Once you have the desired bump you need, the CLI will ask for a summary. Here
you have full freedom on what to include:

```
🦋  Which packages would you like to include? · @verdaccio/config
🦋  Which packages should have a major bump? · No items were selected
🦋  Which packages should have a minor bump? · No items were selected
🦋  The following packages will be patch bumped:
🦋  @verdaccio/config@5.0.0-alpha.0
🦋  Please enter a summary for this change (this will be in the changelogs). Submit empty line to open external editor
🦋  Summary ›
```

The last step is to confirm your changeset or abort the operation:

```
🦋  Is this your desired changeset? (Y/n) · true
🦋  Changeset added! - you can now commit it
🦋
🦋  If you want to modify or expand on the changeset summary, you can find it here
🦋  info /Users/user/verdaccio.clone/.changeset/light-scissors-smell.md
```

Once the changeset is added (all will have a unique name) you can freely edit
using markdown, adding additional information, code snippets or whatever else
you consider to be relevant.

All that information will be part of the **changelog**. Be concise but
informative! It's recommended to add your nickname and GitHub link to your
profile.

**PRs that do not follow the commit message guidelines will not be merged.**

### Update Tests

**Any change in source code must include test updates**.

If you need help with how testing works, please [refer to the following guide
](https://github.com/verdaccio/verdaccio/wiki/Running-and-Debugging-tests).

**If you are introducing new features, you MUST include new tests. PRs for
features without tests will not be merged.**

## Translations {#translations}

All translations are provided by the **[crowdin](http://crowdin.com)** platform,
[https://translate.verdaccio.org/](https://translate.verdaccio.org/)

If you want to contribute by adding translations, create an account (GitHub could be used as fast alternative), in the platform you can contribute to two areas, the website or improve User Interface translations.

> Languages with less the 40% of translations available are excluded by the build system.

If a language is not listed, ask for it in the [Discord](https://discord.gg/7qWJxBf) channel #contribute channel.

For adding a new **language** on the UI follow these steps:

1. Ensure the **language** has been enabled, must be visible in the `crowdin` platform.
2. Find in the explorer the file `en.US.json` in the path `packages/plugins/ui-theme/src/i18n/crowdin/ui.json` and complete the translations, **not need to find approval on this**.
3. Into the project, add a new field into `packages/plugins/ui-theme/src/i18n/crowdin/ui.json` file, in the section `lng`, the new language, eg: `{ lng: {korean:"Korean"}}`. (This file is English based, once the PR has been merged, this string will be available in crowdin for translate to the targeted language).
4. Add the language, [flag icon](https://www.npmjs.com/package/country-flag-icons), and the menu key for the new language eg: `menuKey: 'lng.korean'` to the file `packages/plugins/ui-theme/src/i18n/enabledLanguages.ts`.
5. For local testing, read `packages/plugins/ui-theme/src/i18n/ABOUT_TRANSLATIONS.md`.
6. Add a `changeset` file, see more info below.

## Develop Plugins {#develop-plugins}

Plugins are add-ons that extend the functionality of the application.

If you want to develop your own plugin:

1. Check whether there is a legacy Sinopia plugin for the feature that you need
   via [npmjs](https://www.npmjs.com/search?q=sinopia)
2. Keep in mind the [life-cycle to load a plugin
   ](https://verdaccio.org/docs/en/dev-plugins)
3. You are free to host your plugin in your repository
4. Provide a detailed description of your plugin to help users understand how to
   use it
