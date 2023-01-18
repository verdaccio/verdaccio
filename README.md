![verdaccio logo](https://cdn.verdaccio.dev/readme/verdaccio@2x.png)

![verdaccio gif](https://cdn.verdaccio.dev/readme/readme-website.png)

# Version 5

[Verdaccio](https://verdaccio.org/) is a simple, **zero-config-required local private npm registry**.
No need for an entire database just to get started! Verdaccio comes out of the box with
**its own tiny database**, and the ability to proxy other registries (eg. npmjs.org),
caching the downloaded modules along the way.
For those looking to extend their storage capabilities, Verdaccio
**supports various community-made plugins to hook into services such as Amazon's s3,
Google Cloud Storage** or create your own plugin.

[![verdaccio (latest)](https://img.shields.io/npm/v/verdaccio/latest.svg)](https://www.npmjs.com/package/verdaccio)
[![verdaccio (downloads)](https://img.shields.io/npm/dy/verdaccio.svg)](https://www.npmjs.com/package/verdaccio)
[![docker pulls](https://img.shields.io/docker/pulls/verdaccio/verdaccio.svg?maxAge=43200)](https://verdaccio.org/docs/en/docker.html)
[![backers](https://opencollective.com/verdaccio/tiers/backer/badge.svg?label=Backer&color=brightgreen)](https://opencollective.com/verdaccio)
[![stackshare](https://img.shields.io/badge/Follow%20on-StackShare-blue.svg?logo=stackshare&style=flat)](https://stackshare.io/verdaccio)

[![discord](https://img.shields.io/discord/388674437219745793.svg)](https://discord.gg/7qWJxBf)
[![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)
[![Crowdin](https://d322cqt584bo4o.cloudfront.net/verdaccio/localized.svg)](https://crowdin.com/project/verdaccio)

[![Github](https://img.shields.io/github/stars/verdaccio/verdaccio.svg?style=social&label=Stars)](https://github.com/verdaccio/verdaccio/stargazers)
[![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)

## Install

Install with npm:

```bash
npm install --location=global verdaccio
```

> Node.js v12 or higher is required for Verdaccio 5

or pull [Docker official image](https://verdaccio.org/docs/docker)

```bash
docker pull verdaccio/verdaccio
```

and run

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

or with _helm_ [official chart](https://github.com/verdaccio/charts).

```bash
helm repo add verdaccio https://charts.verdaccio.org
helm repo update
helm install verdaccio/verdaccio
```

Are you still using **Verdaccio 4**?. Check the [migration guide from 4.x to 5.x](https://verdaccio.org/blog/2021/04/14/verdaccio-5-migration-guide).

## Programmatic API

Verdaccio can be used as a module for launch a server programmatically, [you can find more info at the website](https://verdaccio.org/docs/verdaccio-programmatically#using-the-module-api).

```
 const {runServer} = require('verdaccio');
 const app = await runServer(); // default configuration
 const app = await runServer('./config/config.yaml');
 const app = await runServer({ configuration });
 app.listen(4873, (event) => {
   // do something
 });
```

## Verdaccio 6 next

[Verdaccio 6 is on the way](https://github.com/verdaccio/verdaccio/discussions/2970), meanwhile is ready you can start testing (not for production) the new release with:

> Latest Node.js v16 required

Install with npm:

```bash
npm install --location=global verdaccio@6-next
```

or

```bash
docker pull verdaccio/verdaccio:nightly-master
```

The migration notes can be find [here](https://github.com/verdaccio/verdaccio/blob/master/docs/migration-v5-to-v6.md).

## Plugins

You can develop your own [plugins](https://verdaccio.org/docs/plugins) with the [verdaccio generator](https://github.com/verdaccio/generator-verdaccio-plugin). Installing [Yeoman](https://yeoman.io/) is required.

```
npm install --location=global yo
npm install --location=global generator-verdaccio-plugin
```

Learn more [here](https://verdaccio.org/docs/dev-plugins) how to develop plugins. Share your plugins with the community.

## Donations

Verdaccio is run by **volunteers**; nobody is working full-time on it. If you find this project to be useful and would like to support its development and maintenance.

You can donate **[GitHub Sponsors](https://github.com/sponsors/verdaccio)** or **[Open Collective](https://opencollective.com/verdaccio)** 💵👍🏻 starting from _$1/month_ or just one single contribution.

## What does Verdaccio do for me?

### Use private packages

If you want to use all benefits of npm package system in your company without sending all code to the public, and use your private packages just as easy as public ones.

### Cache npmjs.org registry

If you have more than one server you want to install packages on, you might want to use this to decrease latency
(presumably "slow" npmjs.org will be connected to only once per package/version) and provide limited failover (if npmjs.org is down, we might still find something useful in the cache) or avoid issues like _[How one developer just broke Node, Babel and thousands of projects in 11 lines of JavaScript](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/)_, _[Many packages suddenly disappeared](https://github.com/npm/registry-issue-archive/issues/255)_ or _[Registry returns 404 for a package I have installed before](https://github.com/npm/registry-issue-archive/issues/329)_.

### Link multiple registries

If you use multiples registries in your organization and need to fetch packages from multiple sources in one single project you might take advance of the uplinks feature with Verdaccio, chaining multiple registries and fetching from one single endpoint.

### Override public packages

If you want to use a modified version of some 3rd-party package (for example, you found a bug, but maintainer didn't accept pull request yet), you can publish your version locally under the same name. See in detail [here](https://verdaccio.org/docs/en/best#override-public-packages).

### E2E Testing

Verdaccio has proved to be a lightweight registry that can be
booted in a couple of seconds, fast enough for any CI. Many open source projects use verdaccio for end to end testing, to mention some examples, **create-react-app**, **mozilla neutrino**, **pnpm**, **storybook**, **babel.js**, **angular-cli** or **docusaurus**. You can read more in [here](https://verdaccio.org/docs/e2e).

Furthermore, here few examples how to start:

- [e2e-ci-example-gh-actions](https://github.com/juanpicado/e2e-ci-example-gh-actions)
- [verdaccio-end-to-end-tests](https://github.com/juanpicado/verdaccio-end-to-end-tests)
- [verdaccio-fork](https://github.com/juanpicado/verdaccio-fork)

## Talks

- [**NodeTLV 20222** - Deep dive into Verdaccio, a lightweight Node.js registry - **Juan Picado**](https://portal.gitnation.org/contents/five-ways-of-taking-advantage-of-verdaccio-your-private-and-proxy-nodejs-registry)
- [Five Ways of Taking Advantage of Verdaccio, Your Private and Proxy Node.js Registry **Node Congress 2022** - **Juan Picado**](https://portal.gitnation.org/contents/five-ways-of-taking-advantage-of-verdaccio-your-private-and-proxy-nodejs-registry)
- [Using Docker and Verdaccio to make Integration Testing Easy - **Docker All Hands #4 December - 2021** - **Juan Picado**](https://www.youtube.com/watch?v=zRI0skF1f8I)

[View more in the YouTube channel](https://www.youtube.com/channel/UC5i20v6o7lSjXzAHOvatt0w).

## Get Started

Run in your terminal

```bash
verdaccio
```

You would need set some npm configuration, this is optional.

```bash
$ npm set registry http://localhost:4873/
```

For one-off commands or to avoid setting the registry globally:

```bash
NPM_CONFIG_REGISTRY=http://localhost:4873 npm i
```

Now you can navigate to [http://localhost:4873/](http://localhost:4873/) where your local packages will be listed and can be searched.

> Warning: Verdaccio [does not currently support PM2's cluster mode](https://github.com/verdaccio/verdaccio/issues/1301#issuecomment-489302298), running it with cluster mode may cause unknown behavior.

## Publishing

#### 1. create a user and log in

```bash
npm adduser --registry http://localhost:4873
```

> if you use HTTPS, add an appropriate CA information ("null" means get CA list from OS)

```bash
$ npm set ca null
```

#### 2. publish your package

```bash
npm publish --registry http://localhost:4873
```

This will prompt you for user credentials which will be saved on the `verdaccio` server.

## Docker

Below are the most commonly needed information,
every aspect of Docker and verdaccio is [documented separately](https://www.verdaccio.org/docs/en/docker.html)

```
docker pull verdaccio/verdaccio
```

Available as [tags](https://hub.docker.com/r/verdaccio/verdaccio/tags/).

```
docker pull verdaccio/verdaccio:5.x-next
```

### Running verdaccio using Docker

To run the docker container:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

Docker examples are available [in this repository](https://github.com/verdaccio/docker-examples).

## Compatibility

Verdaccio aims to support all features of a standard npm client that make sense to support in private repository. Unfortunately, it isn't always possible.

### Basic features

- Installing packages (`npm install`, `npm upgrade`, etc.) - **supported**
- Publishing packages (`npm publish`) - **supported**

### Advanced package control

- Unpublishing packages (`npm unpublish`) - **supported**
- Tagging (`npm tag`) - **supported**
- Deprecation (`npm deprecate`) - **supported**

### User management

- Registering new users (`npm adduser {newuser}`) - **supported**
- Change password (`npm profile set password`) - **supported**
- Transferring ownership (`npm owner add {user} {pkg}`) - not supported, _PR-welcome_
- Token (`npm token`) - **supported** (under flag)

### Miscellany

- Search (`npm search`) - **supported** (cli (`/-/all` and `v1`) / browser)
- Ping (`npm ping`) - **supported**
- Starring (`npm star`, `npm unstar`, `npm stars`) - **supported**

### Security

- npm/yarn audit - **supported**

## Report a vulnerability

If you want to report a security vulnerability, please follow the steps which we have defined for you in our [security policy](https://github.com/verdaccio/verdaccio/security/policy).

## Contributors

| [Juan Picado](https://github.com/juanpicado)                                  | [Ayush Sharma](https://github.com/ayusharma)                            | [Sergio Hg](https://github.com/sergiohgz)                                |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| ![jotadeveloper](https://avatars3.githubusercontent.com/u/558752?s=80&v=4)    | ![ayusharma](https://avatars2.githubusercontent.com/u/6918450?s=80&v=4) | ![sergiohgz](https://avatars2.githubusercontent.com/u/14012309?s=80&v=4) |
| [@jotadeveloper](https://fosstodon.org/@jotadeveloper)                        | [@ayusharma\_](https://twitter.com/ayusharma_)                          | [@sergiohgz](https://twitter.com/sergiohgz)                              |
| [Priscila Oliveria](https://github.com/priscilawebdev)                        | [Daniel Ruf](https://github.com/DanielRuf)                              |
| ![priscilawebdev](https://avatars2.githubusercontent.com/u/29228205?s=80&v=4) | ![DanielRuf](https://avatars3.githubusercontent.com/u/827205?s=80&v=4)  |
| [@priscilawebdev](https://twitter.com/priscilawebdev)                         | [@DanielRufde](https://twitter.com/DanielRufde)                         |

[See the full list of contributors is at the website.](https://verdaccio.org/contributors)

## Who is using Verdaccio?

- [create-react-app](https://github.com/facebook/create-react-app/blob/master/CONTRIBUTING.md#customizing-e2e-registry-configuration) _(+96.2k ⭐️)_
- [Gatsby](https://github.com/gatsbyjs/gatsby) _(+53.5k ⭐️)_
- [Babel.js](https://github.com/babel/babel) _(+41.3k ⭐️)_
- [Docusaurus](https://github.com/facebook/docusaurus) _(+37k ⭐️)_
- [Vue CLI](https://github.com/vuejs/vue-cli) _(+29.4k ⭐️)_
- [Angular CLI](https://github.com/angular/angular-cli) _(+25.6k ⭐️)_
- [Uppy](https://github.com/transloadit/uppy) _(+25.8k ⭐️)_
- [pnpm](https://github.com/pnpm/pnpm) _(+19.2k ⭐️)_
- [bit](https://github.com/teambit/bit) _(+15k ⭐️)_
- [NX](https://github.com/nrwl/nx) _(+14.1k ⭐️)_
- [Aurelia Framework](https://github.com/aurelia/framework) _(+11.6k ⭐️)_
- [ethereum/web3.js](https://github.com/ethereum/web3.js) _(+9.8k ⭐️)_
- [webiny-js](https://github.com/webiny/webiny-js) _(+5.9k ⭐️)_
- [workshopper how to npm](https://github.com/workshopper/how-to-npm) _(+1k ⭐️)_
- [Amazon SDK v3](https://github.com/aws/aws-sdk-js-v3)
- [Amazon Encryption SDK for Javascript](https://github.com/aws/aws-encryption-sdk-javascript)

🤓 Don't be shy, add yourself to this readme.

## Open Collective Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/verdaccio#sponsor)]

[![sponsor](https://opencollective.com/verdaccio/sponsor/0/avatar.svg)](https://opencollective.com/verdaccio/sponsor/0/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/1/avatar.svg)](https://opencollective.com/verdaccio/sponsor/1/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/2/avatar.svg)](https://opencollective.com/verdaccio/sponsor/2/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/3/avatar.svg)](https://opencollective.com/verdaccio/sponsor/3/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/4/avatar.svg)](https://opencollective.com/verdaccio/sponsor/4/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/5/avatar.svg)](https://opencollective.com/verdaccio/sponsor/5/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/6/avatar.svg)](https://opencollective.com/verdaccio/sponsor/6/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/7/avatar.svg)](https://opencollective.com/verdaccio/sponsor/7/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/8/avatar.svg)](https://opencollective.com/verdaccio/sponsor/8/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/9/avatar.svg)](https://opencollective.com/verdaccio/sponsor/9/website)

## Open Collective Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/verdaccio#backer)]

[![backers](https://opencollective.com/verdaccio/backers.svg?width=890)](https://opencollective.com/verdaccio#backers)

## Special Thanks

Thanks to the following companies to help us to achieve our goals providing free open source licenses.

[![jetbrain](assets/thanks/jetbrains/logo.png)](https://www.jetbrains.com/)
[![crowdin](assets/thanks/crowdin/logo.png)](https://crowdin.com/)
[![browserstack](https://cdn.verdaccio.dev/readme/browserstack_logo.png)](https://www.browserstack.com/)

Verdaccio also is part of to the [Docker Open Source Program](https://www.docker.com/blog/expanded-support-for-open-source-software-projects/).

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].

[![contributors](https://opencollective.com/verdaccio/contributors.svg?width=890&button=true)](../../graphs/contributors)

### FAQ / Contact / Troubleshoot

If you have any issue you can try the following options, do no desist to ask or check our issues database, perhaps someone has asked already what you are looking for.

- [Blog](https://verdaccio.org/blog/)
- [Donations](https://github.com/sponsors/verdaccio)
- [Reporting an issue](https://github.com/verdaccio/verdaccio/issues/new/choose)
- [Running discussions](https://github.com/verdaccio/verdaccio/issues?q=is%3Aissue+is%3Aopen+label%3Adiscuss)
- [Chat](https://discord.gg/7qWJxBf)
- [Logos](https://verdaccio.org/docs/en/logo)
- [Docker Examples](https://github.com/verdaccio/verdaccio/tree/master/docker-examples)
- [FAQ](https://github.com/verdaccio/verdaccio/discussions/categories/q-a)

### License

Verdaccio is [MIT licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)

The Verdaccio documentation and logos (excluding /thanks, e.g., .md, .png, .sketch) files within the /assets folder) is
[Creative Commons licensed](https://creativecommons.org/licenses/by/4.0/).
