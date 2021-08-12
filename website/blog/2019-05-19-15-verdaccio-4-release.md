---
author: Ayush Sharma
authorURL: https://twitter.com/ayusharma_
authorFBID: 100001655957183
title: Verdaccio 4 released !!!
---

# Release name: Freedom

Verdaccio is a free open source javascript package proxy registry. It is fully compatible with [pnpm](https://pnpm.js.org/), [yarn](https://yarnpkg.com) and [npm](https://www.npmjs.com/) package management clients. It follows the CommonJS compliant package specifications.

You can install and upgrade to the latest version by following commands:

using **npm**

```
npm install -g verdaccio@4.0.0
```

or using **Yarn**

```
yarn global add verdaccio@4.0.0
```

or using **pnpm**

```
pnpm install -g verdaccio@4.0.0
```

You can find detailed installation instructions [here](https://verdaccio.org/docs/en/installation)

<!--truncate-->

## Why 'Freedom' ? {#why-freedom-}

Verdaccio originated from [Sinopia](https://github.com/rlidwka/sinopia) almost three years ago and since then the [Verdaccio Team](https://verdaccio.org/en/team) maintaining and releasing major release every year. Since the fork, the project has evolved in many ways, making the project’s code base modern, easier to debug and more straightforward to contribute.

The name Freedom holds true meaning for Verdaccio@4.x release. Verdaccio is a strong community of many contributors and developers from across the world, providing an ideal platform for everyone to give control of their code. Also, Verdaccio@4.x is free from tech debt of legacy code and stands on design patterns of the modern era which consist [React](https://reactjs.org/), [Typescript](https://www.typescriptlang.org/), [JWT](https://jwt.io/), [Docker](https://www.docker.com/) & [Kubernetes](https://kubernetes.io/). We can call it Freedom in true sense.

Let's take a quick look at the life cycle and development of Verdaccio community:

- **Verdaccio (version 2 - Release name: Birth)** - Focused on stability, code quality, improvement in architecture of the old [Sinopia](https://github.com/rlidwka/sinopia) project and community development.

- **Verdaccio (version 3 - Release name: Hope)** - Redesigned the user interface in [React](https://reactjs.org/) and introduced the simplicity of the plugins development. The [Verdaccio Team](https://verdaccio.org/en/team) and many contributors made the project almost bug free and robust. This was the time the project started to grow and other projects started using it.

Verdaccio@4.x is coming up with many exciting new CLI commands for package management, Fast and responsive user interface, security upgrades and easy deployments.

Excited?? Yes !!! Let's go !!

## So what's changed? TL;DR {#so-whats-changed-tldr}

- [New User Interface](#new-user-interface)
  - [New search Process](#new-search-process)
  - [Register Information](#register-information)
  - [Packages](#packages)
  - [Detailed Page](#detailed-page)
  - [Package Sidebar](#package-sidebar)
- [New Browser Router APIs](#new-browser-router)
- [Unpublish Role](#unpublish-role)
- [Disable Gravatar](#disable-gravatar)
- [New CLI Commands](#new-cli-commands)
  - [npm star](#npm-star)
  - [npm profile](#npm-profile)
- [JWT Token](#jwt-token)
- [Docker Improvements](#docker-improvements)
- [Drop Node 6 Support](#drop-node-6-support)
- [Plugins](#plugins)
- [Tech Updates](#tech-updates)
  - [Verdaccio ESLint Config](#verdaccio-eslint-config)
  - [Verdaccio Babel Preset](#verdaccio-babel-preset)
  - [Verdaccio UI Plugin](#vedaccio-ui-plugin)
  - [Meetup & Conferences](#meetup-&-conferences)
- [Trusted by Many](#trusted-by-many)
- [New to Verdaccio / FAQ / Contact / Troubleshoot](#new-to-verdaccio-/-faq-/-contact-/-troubleshoot)

## New User Interface {#new-user-interface}

Verdaccio@4.x comes with a new shiny appealing user interface, providing more details to show and easy to navigate. We did major changes in Verdaccio web application and everything is designed from scratch.

![verdaccio-main-page](https://cdn.verdaccio.dev/blog/4.x-release/verdaccio-main-page.png)

### New Search Process {#new-search-process}

Verdaccio@3.x has a limited search functionality and it was implemented on the browser side. Verdaccio@4.x provides fast and quick search results from the backend.

![new-search-process](https://cdn.verdaccio.dev/blog/4.x-release/search.png)

### Register Information {#register-information}

The Register information is easily accessible and can be seen by clicking on `information` icon in header.

![register-info-modal-image](https://cdn.verdaccio.dev/blog/4.x-release/register-info.png)

### Packages {#packages}

The new Package card provides more information about a package, easy to open issues and documentation link without navigating into package details.

**Order**: Verdaccio@4.x has basic support for package ordering from `config.yaml`. The package list can be sorted ascending & descending. [Find out more](https://verdaccio.org/docs/en/webui#configuration)

### Detailed Page {#detailed-page}

The new Detailed package in a more categorized manner for readme, dependencies, version and uplinks.

![verdaccio-detail-page](https://cdn.verdaccio.dev/blog/4.x-release/detail-page.png)

### Package Sidebar {#package-sidebar}

The Package Sidebar includes most relevant information from package metadata. You can open an issue, see Readme and download the package tarball. It also clearly shows the package's minimum requirements on node and npm.

Also, The package sidebar shows _Author_, _Maintainers_ and _Contributors_ in different sections. When you click on person avatar, you'll be able to contact that person via email.

## New Browser Router {#new-browser-router}

Till, verdaccio@3.x we have Hash Router implementation on frontend application routes. We faced a lot of problem with hash router in the Readme section. The Readme also uses (#) hash for the heading tags and anchor elements.

In Verdaccio@4.x, we migrated the Hash Router to Browser Router with a more cleaner look. (No more hashes in URLs).

## Unpublish Role {#unpublish-role}

Verdaccio@4.x improves package management by adding an access layer to publish and unpublish. Now you can have restrictions to some of the users for publishing and unpublishing. [Find out more](https://verdaccio.org/docs/en/packages#unpublishing-packages)

## Disable Gravatar {#disable-gravatar}

Verdaccio uses [Gravatar](https://en.gravatar.com) to show the images of authors, contributors and maintainers. Now, gravatar support can be disabled from Verdaccio `config.yaml`.

```yaml
web:
  title: Verdaccio
  gravatar: false
```

In order to be fully offline, The fallback support is a generic user face SVG based on base64.

## New CLI Commands {#new-cli-commands}

We are really excited to add some npm cli commands to Verdaccio. Now you can use `npm star`, and `npm profile`.

### npm star {#npm-star}

Now a user can mark their favorite package.

```
npm star [<package>..]
```

### npm profile {#npm-profile}

With npm profile, a user can change their profile settings.

_Note:_ Verdaccio does not support two-factor authentication yet.

```
npm profile get [--json|--parseable] [<property>]
npm profile set [--json|--parseable] <property> <value>
npm profile set password
```

Check out more at [https://docs.npmjs.com/cli/profile](https://docs.npmjs.com/cli/profile)

## JWT Token {#jwt-token}

Verdaccio supports [JSON Web Tokens](https://jwt.io/) for the authentication. The previous version of Verdaccio used `AES` token generator. The new JWT token standardizes the process and provides an additional mechanism for token generation. Verdaccio@4.x still supports the `AES` token generator.

[Click here for more information on new JWT tokens](https://medium.com/verdaccio/diving-into-jwt-support-for-verdaccio-4-88df2cf23ddc)

## Docker Improvements {#docker-improvements}

There is no doubt that Docker has been a major breakthrough for this project, it's by far the most popular way to download Verdaccio, we have more than [4.200.000 downloads at this writing](https://dockeri.co/image/verdaccio/verdaccio) and for such reason, we care about improving the developer experience adding new features.

[Please click here more information on the new Docker Image.](https://verdaccio.org/blog/2019/05/13/the-new-docker-image-verdaccio-4)

## Drop Node 6 Support {#drop-node-6-support}

NodeJS 6 went to [end of life on April 30, 2019](https://github.com/nodejs/Release). Verdaccio@4.x drops the support for Node 6 & npm 3. Now on, Node 8 & npm 5 will be the minimum requirement. Verdaccio@4.x also checks for the minimum node version. https://github.com/verdaccio/verdaccio/pull/968

## Plugins {#plugins}

Verdaccio extends its functionalities with a set of plugins. You can find detailed information in [Plugins Documentation](https://verdaccio.org/docs/en/plugins#verdaccio-plugins)

## Tech Updates {#tech-updates}

Verdaccio 4 heavily relies on plugins and provides APIs for developers to build their own plugins. We introduced few major changes in the development environment to adapt code modularity, decoupling and typed system.

Now the main Verdaccio module is a powerful CLI to package management and a plugin system to introduce new functionalities.

### Verdaccio ESLint config {#verdaccio-eslint-config}

Now on, [Verdaccio Team](https://verdaccio.org/en/team) uses [@verdaccio/eslint-config](https://github.com/verdaccio/eslint-config-verdaccio) across all the repositories to maintain the same coding style.

### Verdaccio Babel Preset {#verdaccio-babel-preset}

As Babel@7 released in 2018, [Verdaccio Team](https://verdaccio.org/en/team) updated babel dependencies to the latest. We also created a central repository for the Babel preset [@verdaccio/babel-preset](https://github.com/verdaccio/babel-preset)

### Verdaccio UI Plugin {#verdaccio-ui-plugin}

Verdaccio provides an easy configuration system to enable/disable of web application. Verdaccio is used as End-to-End(E2E) tooling system in many platforms and shipping UI along with Verdaccio is a non-beneficial overhead. So we separated the UI module and it's repository for simple & easy development and maintainability.

You can find UI repository [here](https://github.com/verdaccio/ui).

### Meetup & Conferences {#meetup--conferences}

Since Verdaccio@3.x release, Verdaccio contributors are actively participating in community activities, conferences, meetup and on twitter.

- [Dot Conference 2018, Paris](https://twitter.com/ayusharma_/status/1060224341768572928)
- [React day 2018, Berlin](https://twitter.com/verdaccio_npm/status/1067420167867695105)
- JS Heroes 2019, Cluj Napoca ∙ [Small talk](https://twitter.com/jotadeveloper/status/1116314948962004992) ∙ [Presence](https://twitter.com/verdaccio_npm/status/1116608322700857344)
- [ViennaJS Meetup](https://www.youtube.com/watch?v=hDIFKzmoCaA)
- [Madrid NodeJS Meetup](https://www.todojs.com/introduccion-a-verdaccio/)
- [Hacktober Fest 2018](https://github.com/verdaccio/verdaccio/issues/973)

### Trusted by Many {#trusted-by-many}

[Verdaccio Team](https://verdaccio.org/en/team) is very happy to share that following projects are using Verdaccio as their End-to-End (E2E) testing tool.

- [create-react-app](https://github.com/facebook/create-react-app/blob/master/CONTRIBUTING.md#contributing-to-e2e-end-to-end-tests)
- [Storybook](https://github.com/storybooks/storybook)
- [Gatsby](https://github.com/gatsbyjs/gatsby)
- [Uppy](https://github.com/transloadit/uppy)
- [Aurelia Framework](https://github.com/aurelia)
- [bit](https://github.com/teambit/bit)
- [pnpm](https://github.com/pnpm/pnpm)
- [Mozilla Neutrino](https://github.com/neutrinojs/neutrino)
- [Hyperledger Composer](https://github.com/hyperledger/composer)

### New to Verdaccio / FAQ / Contact / Troubleshoot {#new-to-verdaccio--faq--contact--troubleshoot}

We welcome you in Verdaccio community and we look forward for your feedback and contribution to the project.

If you have any issue you can try the following options, do no desist to ask or check our issues database, perhaps someone has asked already what you are looking for.

- [Blog](https://medium.com/verdaccio)
- [Donations](https://opencollective.com/verdaccio)
- [Roadmap](https://github.com/verdaccio/verdaccio/projects)
- [Reporting an issue](https://github.com/verdaccio/verdaccio/blob/master/CONTRIBUTING.md#reporting-a-bug)
- [Running discussions](https://github.com/verdaccio/verdaccio/issues?q=is%3Aissue+is%3Aopen+label%3Adiscuss)
- [Chat](http://chat.verdaccio.org/)
- [Logos](https://verdaccio.org/docs/en/logo)
- [FAQ](https://github.com/verdaccio/verdaccio/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3Aquestion%20)
- [Docker Examples](https://github.com/verdaccio/docker-examples)
