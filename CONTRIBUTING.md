# Contributing to Verdaccio

We are happy you wish to contribute this project, for that reason we want to board you with this guide.

## How I contribute?


### Ways to contribute

There are many ways to contribute to the Verdaccio Project. Here’s a list of technical contributions with increasing levels of involvement and required knowledge of Verdaccio's code and operations.

* [Reporting a Bug](CONTRIBUTING.md#reporting-a-bug)
* [Request Features](CONTRIBUTING.md#request-features)
* [Plugins](CONTRIBUTING.md#plugins)
* [Improve the Documentation](wiki/README.md)

Please read carefully this document. It will guide you to provide maintainers and readers valuable information to boots the process solve the issue or evaluate your proposal.

## Reporting a Bug

We welcome clear bug reports. If you've found a bug in Verdaccio that isn't a security risk, please file a report in our [issue tracker](https://github.com/verdaccio/verdaccio/issues). Before you file your issue, search to see if it has already been reported. If so, up-vote (using GitHub reactions) or add additional helpful details to the existing issue to show that it's affecting multiple people.
 
### Check if there's a simple solution in the wiki.

Some of the most popular topics can be found in our [wiki](https://github.com/verdaccio/verdaccio/wiki), that would be the first place to look at the topic you are interested.

### Questions & Chat

We have tagged questions for easy follow up under the tag [questions](https://github.com/verdaccio/verdaccio/labels/question). Additionaly, I'd recommend to deliver questions in the new chat as **#questions/#development** channels at  [gitter](https://gitter.im/verdaccio/). 

### Look at the past

* Verdaccio is a fork of `sinopia@1.4.0`, thereforce, there is a huge [database of tickets](https://github.com/rlidwka/sinopia/issues) in the original projet. It's a good place to find answers. 
* Questions under the tag of [sinopia](http://stackoverflow.com/questions/tagged/sinopia) or [verdaccio](http://stackoverflow.com/search?q=verdaccio) at Stackoverflow  might be helpful.

### Using the issue tracker

The issue tracker is a channel were mostly users/developers post.

#### I want to report a bug

We considere a bug a feature that is not working as is described in the documentation. Before reporte a bug follow the next steps:

1. Use the GitHub issue search — check if the issue has already been reported.

2. Check if the issue has been fixed — try to reproduce it using the latest master or development branch in the repository.

Verdaccio still does not support all npm commands due either in the initial design were not considered important or nobody has request it yet.

## Request Features

A new feature is always welcome, thus, analyse whether you ir idea fits in the scope of the project and elaborate your request providing enough context, for instance:

* A wide description the advantages of your request.
* It's compatible with `npm` and `yarn`?
* You might implement your feature and provide a forked repository as example.
* Whatever you have on mind 🤓.

### Submitting a Pull Request
The following are the general steps you should follow in creating a pull request.  Subsequent pull requests only need
to follow step 3 and beyond:

1. Fork the repository on GitHub
2. Clone the forked repository to your machine
3. Create a "feature" branch in your local repository
4. Make your changes and commit them to your local repository
5. Rebase and push your commits to your GitHub remote fork/repository
6. Issue a Pull Request to the official repository
7. Your Pull Request is reviewed by a committer and merged into the repository

*Note*: While there are other ways to accomplish the steps using other tools, the examples here will assume the most
actions will be performed via the `git` command line.

### 1. Fork the Repository

When logged in to your GitHub account, and you are viewing one of the main repositories, you will see the *Fork* button.
Clicking this button will show you which repositories you can fork to.  Choose your own account.  Once the process
finishes, you will have your own repository that is "forked" from the official one.

Forking is a GitHub term and not a git term.  Git is a wholly distributed source control system and simply worries
about local and remote repositories and allows you to manage your code against them.  GitHub then adds this additional
layer of structure of how repositories can relate to each other.

### 2. Clone the Forked Repository

Once you have successfully forked your repository, you will need to clone it locally to your machine:

```bash
$ git clone --recursive git@github.com:username/verdaccio.git verdaccio
```

This will clone your fork to your current path in a directory named `verdaccio`.

You should also set up the `upstream` repository.  This will allow you to take changes from the "master" repository
and merge them into your local clone and then push them to your GitHub fork:

```bash
$ cd verdaccio
$ git remote add upstream git@github.com:verdaccio/verdaccio.git
$ git fetch upstream
```

Then you can retrieve upstream changes and rebase on them into your code like this:

```bash
$ git pull --rebase upstream master
```

For more information on maintaining a fork, please see the GitHub Help article [Fork a Repo](https://help.github.com/articles/fork-a-repo/) and information on
[rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) from git.

### 3. Create a Branch

The easiest workflow is to keep your master branch in sync with the upstream branch and do not locate any of your own
commits in that branch.  When you want to work on a new feature, you then ensure you are on the master branch and create
a new branch from there.  While the name of the branch can be anything, it can often be easy to use the issue number
you might be working on (if an issue was opened prior to opening a pull request).  For example:

```bash
$ git checkout -b issue-12345 master
Switched to a new branch 'issue-12345'
```

You will then be on the feature branch.  You can verify what branch you are on like this:

```bash
$ git status
# On branch issue-12345
nothing to commit, working directory clean
```

### 4. Make Changes and Commit

#### Before commit

At this point you have ready your changes, your new feature it's ready to be shipped, but, to avoid delays to merge, please be aware the build must past.

Before commit, run the test command:

```bash
npm test
```
It won't have **eslint** errors and **all test must past**. Then, and only then, you should push and ship your **PR**.

*At the moment of this writing, there are plenty of warning to clean, but please  warnings are not fails, but try to don't commit code with warnings*

#### After testing your changes

Now you just need to make your changes.  Once you have finished your changes (and tested them) you need to commit them
to your local repository (assuming you have staged your changes for committing):

```bash
$ git status
# On branch issue-12345
# Changes to be committed:
#   (use "git reset HEAD <file>..." to unstage)
#
#        modified:   somefile.js
#
$ git commit -m "fix: correct some defect, fixes #12345, refs #12346"
[t12345 0000000] fix: correct some defect, fixes #12345, refs #12346
 1 file changed, 2 insertions(+), 2 deletions(-)
```

#### Git Commit Guidelines

We follow the [conventional commit messages](https://conventionalcommits.org/) convention in order to automate Changelog generation and auto semantic versioning based on commit messages. 

* feat: A new feature
* fix: A bug fix

A commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in semantic versioning).

eg: 
```
feat: xxxxxxxxxx
````

A commit of the type fix patches a bug in your codebase (this correlates with PATCH in semantic versioning).

eg: 
```
fix: xxxxxxxxxx
````

Commits types as `docs:`,`style:`,`refactor:`,`perf:`,`test:` and `chore:` are valid but has no effect on versioning, but, it would be great if you use them.


### 5. Rebase and Push Changes

If you have been working on your contribution for a while, the upstream repository may have changed.  You may want to
ensure your work is on top of the latest changes so your pull request can be applied cleanly:

```bash
$ git pull --rebase upstream master
```

When you are ready to push your commit to your GitHub repository for the first time on this branch you would do the
following:

```bash
$ git push -u origin issue-12345
```

After the first time, you simply need to do:

```bash
$ git push
```

### 6. Issue a Pull Request

In order to have your commits merged into the main repository, you need to create a pull request.  The instructions for
this can be found in the GitHub Help Article [Creating a Pull Request](https://help.github.com/articles/creating-a-pull-request/).  Essentially you do the following:

1. Go to the site for your repository.
2. Click the Pull Request button.
3. Select the feature branch from your repository.
4. Enter a title and description of your pull request in the description.
5. Review the commit and files changed tabs.
6. Click `Send Pull Request`

You will get notified about the status of your pull request based on your GitHub settings.


## Plugins

Plugins are Add-ons that extend the functionality of the application. Whether you want develop your own plugin I'd suggest do the following:

1. Check whether there is a legacy sinopia plugin for the feature that you need at [npmjs](https://www.npmjs.com/search?q=sinopia).
2. There is a [life-cycle to load a plugin](https://github.com/verdaccio/verdaccio/blob/master/lib/plugin-loader.js#L22) you should keep on mind.
3. You are free to host your plugin in your repository, whether you want to host within in our organization, feel free to ask, we'll happy to host it.
4. Try a describe widely your plugin to provide a deeply understanding to your users.
