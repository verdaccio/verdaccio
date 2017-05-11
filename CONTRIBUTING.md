# Contributing to Verdaccio

Wanna **contribute**? Please read carefully this document. It will guide you to provide maintainers and readers valuable information to boots the process solve the issue or evaluate your proposal.

## Before submit a new issue
 
### 1. Check if there's a simple solution in the wiki.

Some of the most popular topics can be found in our [wiki](https://github.com/verdaccio/verdaccio/wiki), that would be the first place to look at the topic you are interested.

### 2. Questions & Chat

We have tagged questions for easy follow up under the tag [questions](https://github.com/verdaccio/verdaccio/labels/question). Additionaly, I'd recommend to deliver questions in the new chat as **#questions/#development** channels at  [slack](https://verdaccio-npm.slack.com). 

### 3. Look at the past

* Verdaccio is a fork of sinopia, thereforce, there is a huge [database of tickets](https://github.com/rlidwka/sinopia/issues) in the original projet. It's a good place to find answers. 
* Questions under the tag of [sinopia](http://stackoverflow.com/questions/tagged/sinopia) or [verdaccio](http://stackoverflow.com/search?q=verdaccio) at Starckoverflow  might be helpful.

### 4. Using the issue tracker

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

### Before commit
At this point you have ready your changes, your new feature it's ready to be shipped, but, to avoid delays to merge, please be aware the build must past.

Before commit, run the test command:

```bash
npm test
```
It won't have **eslint** errors and **all test must past**. Then, and only then, you should push and ship your **PR**.

*At the moment of this writing, there are plenty of warning to clean, but please  warnings are not fails, but try to don't commit code with warnings*

## Plugins

Plugins are Add-ons that extend the functionality of the application. Whether you want develop your own plugin I'd suggest do the following:

1. Check whether there is a legacy sinopia plugin for the feature that you need at [npmjs](https://www.npmjs.com/search?q=sinopia).
2. There is a [life-cycle to load a plugin](https://github.com/verdaccio/verdaccio/blob/master/lib/plugin-loader.js#L22) you should keep on mind.
3. You are free to host your plugin in your repository, whether you want to host within in our organization, feel free to ask, we'll happy to host it.
4. Try a describe widely your plugin to provide a deeply understanding to your users.