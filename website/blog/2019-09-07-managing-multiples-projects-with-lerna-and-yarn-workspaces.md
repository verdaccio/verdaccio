---
title: Managing multiples projects with Lerna and Yarn Workspaces
author: Sergio Herrera
authorURL: https://github.com/sergiohgz
authorImageURL: https://avatars3.githubusercontent.com/u/14012309
authorTwitter: sergiohgz
---

Verdaccio is a project with a big ecosystem, composed by several projects, each one with its own configurations and ways to manage. This fact transforms a simple maintenance operation, like updating a common dependency, into a real hard work.

We saw a problem, these configurations entropy made harder to work with all the projects. So, we needed to simplify and unify them to make it easier. We need a **monorepo**.

A monorepo is a project configuration to manage a collection of dependencies in a simple and unified way. There are many examples out there that Javascript developer use nowadays, like [Babel](https://babeljs.io/), [Create React App](https://create-react-app.dev/) or [Material UI](https://material-ui.com/).

Now, we are proud to announce our [monorepo](https://github.com/verdaccio/monorepo), our big ecosystem joined in only one repository. This article is the first part of a series of articles where we will try to explain our motivation about to set up by your own, improve the management and workflows (CI, code quality, etc).

<!--truncate-->

## Background and tools {#background-and-tools}

A year ago, [Juan](https://twitter.com/jotadeveloper) and I met in Madrid, Spain, and were talking about the roadmap for Verdaccio 4, the scope of the projects and more. We had some concerns about the Verdaccio ecosystem we want to build, such amount of repositories requires hard work for maintenance by each one with their own dependencies, scripts, configurations, etc.

We decided to unify all configurations, because handle several repositories would not be realistic and would have all things replicated in all repositories. In order to achieve our goal, and we found [Lerna](https://lerna.js.org/) and [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/).

As a first step, we created the basic architecture of the monorepo and moved the first dependencies in, an ESLint config and a Babel preset.

After Verdaccio 4 release, Typescript migration and more, we saw that many projects shares the same architecture, so it could be a good moment to achieve our goals.

There are more tools for this purpose, but we will focus on Lerna and Yarn Workspaces.

### Lerna {#lerna}

**Lerna** is a tool to manage several Javascript projects with multiple packages (called _monorepos_), optimizing the workflows around them.

You can install it globally with `npm install --global lerna`, `yarn global add lerna` or your favourite package manager, to run commands with `lerna <command>`. Also, if you don't want to install it, you can use package runners such as `npx`.

### Yarn Workspaces {#yarn-workspaces}

**Yarn Workspaces** is a way to setup package architecture where all packages dependencies are installed together with a single `yarn install`.

This involves two things that you could not see at the first moment.

- All the packages in the workspace uses a common lockfile as a _single source of truth_.
- If a package has a dependency on other package in the workspace, they are linked _without affecting your global environment_.

Since Yarn 1.0, this feature is enabled by default, you only need a root `package.json` to setup them.

## Creating the monorepo {#creating-the-monorepo}

The initial setup is really simple, you only need to create a new repository and run `lerna init` to initialize the monorepo. This will generate files like `package.json` or `lerna.json` (packages structure is shown as example, but not generated).

```
lerna.json
package.json
packages/
├── pkg1
│   └── package.json
├── pkg2
│   └── package.json
└── pkg3
    └── package.json
```

Let's see the main configuration for `lerna.json` and root `package.json`.

### lerna.json {#lernajson}

After initial setup, this file will looks like:

```json
{
  "packages": ["packages/*"],
  "version": "0.0.0"
}
```

- packages: this array defines the location for all packages that conforms the monorepo. They could be explicit (`packages/pkg1`) or, if a folder has several packages, you can use `*` wildcard. In our case, we use `core/*`, `plugins/*` and `tools/*`.
- version: the version of the packages. It could be a semver value (called _fixed mode_) or `independent` if you want to let packages define their own version. Take care that _independent mode_ will create one tag for each package that will be published with its own version. We prefer _fixed mode_ to keep all packages with the same version and reduce headaches to users.

Other interesting settings are:

- npmClient: you can define in you want to use Yarn, Npm or your favourite client.
- useWorkspaces: if you want to enable Yarn Workspaces, you will have to tell it to Lerna, setting this option to `true`.
- stream: if you want to have the output of a child process inmediately in the console, you have to enable this option. Also, this will prefix each line with the package name that generate them.

### package.json {#packagejson}

After initial setup, you need some configuration to allow _Lerna_ work with _Yarn Workspaces_:

- workspaces: this is the array where we define the packages that are part of the workspace. In a simple way, this is the same you have defined in `lerna.json` under the _packages_ key.
- private: as the root package should be a simple container, you should keep it with `true` value to not publish it.

Later, you will learn how to define more settings in the root `package.json`.

## Creating and importing packages {#creating-and-importing-packages}

You have a monorepo, but it's not useful at this moment. Let's create and import some packages.

### lerna create {#lerna-create}

To create new packages, you can use `lerna create <package_name>` like you would do with `npm init` or `yarn init`. The wizard will ask you for some fields like package description, author or license. Other way to give that information is using command options (`--description`, `--author`, etc).

Then, you have the package ready for work with it, add stuff like Babel or ESLint, dependencies and scripts to `package.json`...

It's important to say that if your package is a scoped package, you have to add the next codeblock in `package.json`, but do not add it if your package is not scoped, because `lerna publish` will fail in this case:

```json
"publishConfig": {
  "access": "public"
}
```

### lerna import {#lerna-import}

If you have a project you want to import, you don't have to create a new one in the monorepo, you can import it using `lerna import <path_to_project>`.

This command will read all the Git history from the project specified and apply commit-by-commit into your monorepo to avoid losing the original history. If there were commits with conflicts, the import process will fail, but CLI propose you to use the `--flatten` option to bypass it. Also, if you want to keep original authors and committers, you can pass `--preserve-commit` option.

After the import completes, you can remove unnecessary stuff like CI settings, old scripts, hoisted devDependencies...

## Managing dependencies and devDependencies {#managing-dependencies-and-devdependencies}

Each package will contain their own _dependencies_ and _devDependencies_ like if the package is not in a monorepo, but there are some interesting things you can do with _devDependencies_, hoist them in the root `package.json`.

Let's see with an example, _pkg1_ and _pkg2_ defines ESLint as devDependency, so you have defined that in two packages, duplicating the definition and management. You can extract it from both and set it as devDependency in the root `package.json`. This way, all the projects that need it will have it available. Now, we are going to add ESLint to _pkg3_, you only have to add its own configuration, because package has been hoisted right now.

But the same doesn't work with _dependencies_, because they are needed when the package is published.

A good practice is to hoist every devDependency so they will be available for every package, except in two cases:

- A package needs a specific version of the package. In this case, you can have a root definition for all the packages and the specific version for the package that requires it. This will create a `node_modules` for the specific package, but not another `yarn.lock`.
- Those _devDependencies_ that are part of the workspace must not be defined in the root `package.json`, because if you do that, you will create a cycle. An example is if _pkg1_ and _pkg2_ define _pkg3_ as devDependency, it could not be defined in the root because _pkg3_ will depend with itself.

## Running scripts {#running-scripts}

Like _dependencies_, each package will have their own _scripts_, so you should define them in their specific `package.json`.

But what happens when you want to run scripts for many packages at the same time? You don't need to extract them to the root `package.json` because they will contain specific arguments/options for each project. You can invoke scripts or commands from the root package using two _Lerna_ commands, `lerna run` and `lerna exec`.

The first, `lerna run <script>`, will perform the script provided looking for what packages have it defined in their `packages.json`. This command is useful when you want to build package or run tests, because not all packages would have them defined.

<center>
  ![lerna-run-example](https://cdn.verdaccio.dev/blog/managing-multiples-projects-with-lerna-and-yarn-workspaces/lerna_run_example.png)
</center>

The second, `lerna exec <command>`, will execute the command (not script) in all the packages. This is useful if you want to run tools like ESLint in all the packages and you have it installed globally. In this case, the command invoked must be in your _system PATH_ (`ls`, `cat`, npm binaries, etc).

<center>
  ![lerna-exec-example](https://cdn.verdaccio.dev/blog/managing-multiples-projects-with-lerna-and-yarn-workspaces/lerna_exec_example.png)
</center>

Both commands shares options like `--scope=<packages>` and `--ignore=<packages>`, where the first will run only in packages specified and the last will ignore them.

## Versioning the monorepo {#versioning-the-monorepo}

As we mentioned in [lerna.json](#lerna.json) section there are two versioning ways for packages in monorepos: _fixed mode_ and _independent mode_.

We will focus in _fixed mode_ because:

- We want to use the same version for all the packages in the ecosystem.
- Independent mode creates one _git tag_ for each package and version in each release. With the example before, in a release we will create three tags, _pkg1@0.1.0_, _pkg2@2.1.0_, _pkg3@0.5.2_. In larger codebases you will create more than 10 tags at the same time.

In _fixed mode_, the version set in the _lerna.json_ is a reference for all the packages but, if a package has no changes between releases, that package will not be published except when the version bump is major (from _X.Y.Z_ to _X+1.0.0_).

Because Lerna is going to manage the versioning, you should change your mind to use `lerna version` and `lerna publish` commands.

- `lerna version` will update version for the packages that has changes from the release (you can review with `lerna changed`). This will launch a wizard except if you pass the version or a semver keyword (_major_, _minor_, _patch_, etc) as the first argument or use Conventional Commits (see below). This command updates version in all affected packages, commit changes, create tags and pushes to the remote automatically.  
  Also, you can use `--conventional-commits` option if your commits follows [Conventional Commits spec](https://www.conventionalcommits.org), automating the changelog generation. Additionally, for Github and Gitlab users, you can use `--create-release <github | gitlab>` to create release with changes. Keep in mind that you have to provide an auth token (_GH_TOKEN_ or _GL_TOKEN_).
- `lerna publish` will act as `lerna version` and publish packages if you don't provide `from-git` or `from-package` arguments, or only publish if provide one. You would like to use `from-git` to version first, using Git as a **single source of truth**.

## Conclusion and thanks {#conclusion-and-thanks}

Lerna and Yarn Workspaces are a great combination for creating monorepos. In this first part, you have learned how to setup a monorepo, add packages, improve dependency management, scripts and versioning. In the next chapters, you will see more configuration and tooling (and their settings for monorepos), and how to automate some things using Continuous Integration tools.

We have to thank the teams and community behind both projects, specially [Henry Zhu](https://twitter.com/left_pad) and [Daniel Stockman](https://twitter.com/evocateur) for Lerna, and [Maël Nison](https://twitter.com/arcanis) for Yarn. Also, but not less important, we want to thank all the people that makes Verdaccio possible, contributing, donating, documenting, and more.

> If you 😍 Verdaccio as we do, helps us to grow more donating to the project via [OpenCollective](https://opencollective.com/verdaccio).

Thanks for support Verdaccio ! 👏👏👏👏.
