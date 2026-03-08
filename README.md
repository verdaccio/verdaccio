![verdaccio logo](https://cdn.verdaccio.dev/readme/verdaccio@2x.png)

![verdaccio gif](https://cdn.verdaccio.dev/readme/readme-website.png)

# Version 6

[Verdaccio](https://verdaccio.org/) is a simple, **zero-configuration-required local private npm registry**.
Verdaccio doesn't require a full-fledged database to get started. It comes out of the box with **its own tiny database** and the ability to proxy other registries (e.g., npmjs.org), caching downloaded modules along the way.
For those looking to extend storage capabilities, Verdaccio **supports various community-made plugins that integrate with services such as Amazon S3, Google Cloud Storage, or custom solutions.**

[![verdaccio (latest)](https://img.shields.io/npm/v/verdaccio/latest.svg)](https://www.npmjs.com/package/verdaccio)
[![verdaccio (downloads)](https://img.shields.io/npm/dy/verdaccio.svg)](https://www.npmjs.com/package/verdaccio)
[![docker pulls](https://img.shields.io/docker/pulls/verdaccio/verdaccio.svg?maxAge=43200)](https://verdaccio.org/docs/en/docker.html)
[![backers](https://opencollective.com/verdaccio/tiers/backer/badge.svg?label=Backer&color=brightgreen)](https://opencollective.com/verdaccio)

[![discord](https://img.shields.io/discord/388674437219745793.svg)](https://discord.gg/7qWJxBf)
[![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)
[![Crowdin](https://d322cqt584bo4o.cloudfront.net/verdaccio/localized.svg)](https://crowdin.com/project/verdaccio)

[![Github](https://img.shields.io/github/stars/verdaccio/verdaccio.svg?style=social&label=Stars)](https://github.com/verdaccio/verdaccio/stargazers)
[![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)

## Install

Install with npm:

```bash
npm install --global verdaccio
```

**Node.js v18 or higher is required.**

> Node.js 20 (or the latest LTS version) is recommended.

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

## Programmatic API

Verdaccio can be used as a module to launch a server programmatically. You can find more information on the website.

```
 import {runServer} from 'verdaccio';
 
 const app = await runServer(); // default configuration
 const app = await runServer('./config/config.yaml');
 const app = await runServer({ configuration });
 app.listen(4873, (event) => {
   // do something
 });
```

## Plugins

You can develop your own [plugins](https://verdaccio.org/docs/plugins) using the [verdaccio generator](https://github.com/verdaccio/generator-verdaccio-plugin). [Yeoman](https://yeoman.io/) installation is required.

Learn more about [how to develop plugins](https://verdaccio.org/docs/dev-plugins) and share them with the community.

## Donations

Verdaccio is run by **volunteers**, with no one working on it full-time. If you find this project useful and would like to support its development and maintenance, consider donating.

You can donate at **[Open Collective](https://opencollective.com/verdaccio)** 💵👍🏻 starting from _$1/month_ or with a single contribution.

> **Note:** There is currently **no funding available for contributions or security research**.

## What does Verdaccio do for me?

### Use private packages

If you want to leverage all the benefits of the npm package system within your company without exposing all your code to the public, Verdaccio allows you to use your private packages as easily as public ones.

### Cache npmjs.org registry

If you have multiple servers requiring package installations, caching the npmjs.org registry can significantly decrease latency (as npmjs.org is connected only once per package/version). It also provides limited failover capabilities (if npmjs.org is down, useful packages might still be found in the cache) and helps avoid issues such as _[How one developer just broke Node, Babel and thousands of projects in 11 lines of JavaScript](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/)_, _[Many packages suddenly disappeared](https://github.com/npm/registry-issue-archive/issues/255)_ or _[Registry returns 404 for a package I have installed before](https://github.com/npm/registry-issue-archive/issues/329)_.

### Link multiple registries

If your organization uses multiple registries and you need to fetch packages from various sources within a single project, you can leverage Verdaccio's uplinks feature to chain multiple registries and fetch packages from a single endpoint.

### Override public packages

If you need to use a modified version of a third-party package (e.g., you found a bug, but the maintainer hasn't yet accepted a pull request), you can publish your version locally under the same name. Learn more [here](https://verdaccio.org/docs/en/best#override-public-packages).

### E2E Testing

Verdaccio has proven to be a lightweight registry that can be booted in a couple of seconds, making it fast enough for any CI environment. Many open-source projects utilize Verdaccio for end-to-end testing, including **create-react-app**, **mozilla neutrino**, **pnpm**, **storybook**, **babel.js**, **angular-cli**, and **docusaurus**. You can read more [here](https://verdaccio.org/docs/e2e).

Here are a few examples to get started:

- [e2e-ci-example-gh-actions](https://github.com/juanpicado/e2e-ci-example-gh-actions)
- [verdaccio-end-to-end-tests](https://github.com/juanpicado/verdaccio-end-to-end-tests)
- [verdaccio-fork](https://github.com/juanpicado/verdaccio-fork)

## Talks

- [**NodeTLV 2022** - Deep Dive into Verdaccio, a Lightweight Node.js Registry - Juan Picado](https://portal.gitnation.org/contents/five-ways-of-taking-advantage-of-verdaccio-your-private-and-proxy-nodejs-registry)
- [Five Ways of Taking Advantage of Verdaccio, Your Private and Proxy Node.js Registry - **Node Congress 2022** - Juan Picado](https://portal.gitnation.org/contents/five-ways-of-taking-advantage-of-verdaccio-your-private-and-proxy-nodejs-registry)
- [Using Docker and Verdaccio to Make Integration Testing Easy - **Docker All Hands #4 December 2021** - Juan Picado](https://www.youtube.com/watch?v=zRI0skF1f8I)

[View more on the YouTube channel](https://www.youtube.com/channel/UC5i20v6o7lSjXzAHOvatt0w).

## Get Started

To get started, run Verdaccio in your terminal:

```bash
verdaccio
```

Optionally, you can set some npm configuration:

```bash
$ npm set registry http://localhost:4873/
```

For one-off commands or to avoid setting the registry globally, use:

```bash
NPM_CONFIG_REGISTRY=http://localhost:4873 npm i
```

You can now navigate to [http://localhost:4873/](http://localhost:4873/) where your local packages will be listed and searchable.

> Warning: Verdaccio [does not currently support PM2's cluster mode](https://github.com/verdaccio/verdaccio/issues/1301#issuecomment-489302298). Running it with cluster mode may lead to unknown behavior.

## Publishing

#### 1. Create a User and Log In

```bash
npm adduser --registry http://localhost:4873
```

> If you use HTTPS, add appropriate CA information. ("null" indicates getting the CA list from the OS.)

```bash
$ npm set ca null
```

#### 2. Publish Your Package

```bash
npm publish --registry http://localhost:4873
```

This command will prompt you for user credentials, which will then be saved on the `verdaccio` server.

## Docker

The most commonly needed information is provided below. Every aspect of Docker and Verdaccio is [documented separately](https://www.verdaccio.org/docs/en/docker.html).

```bash
docker pull verdaccio/verdaccio
```

Available as [tags](https://hub.docker.com/r/verdaccio/verdaccio/tags/).

```bash
docker pull verdaccio/verdaccio:6.x-next
```

### Running Verdaccio using Docker

To run the Docker container:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

Docker examples are available [in this repository](https://github.com/verdaccio/docker-examples).

## Compatibility

Verdaccio aims to support all relevant features of a standard npm client for private repositories. However, full compatibility isn't always possible.

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
- Transferring ownership (`npm owner add {user} {pkg}`) - not supported, _PRs welcome_
- Token (`npm token`) - **supported** (under flag)

### Miscellany

- Search (`npm search`) - **supported** (cli (`/-/all` and `v1`) / browser)
- Ping (`npm ping`) - **supported**
- Starring (`npm star`, `npm unstar`, `npm stars`) - **supported**

### Security

- npm/yarn audit - **supported**

## Report a vulnerability

To report a security vulnerability, please follow the steps outlined in our [security policy](https://github.com/verdaccio/verdaccio/policy).



## Open Collective Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/verdaccio#backer)]

[![backers](https://opencollective.com/verdaccio/backers.svg?width=890)](https://opencollective.com/verdaccio#backers)

## Special Thanks

Special thanks to the following companies for helping us achieve our goals by providing free open-source licenses. Each company contributes significant resources to move this project forward.

| Company      | Logo                                                                                                                            | License                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| JetBrains    | [![jetbrain](assets/thanks/jetbrains/logo.png)](https://www.jetbrains.com/)                                                     | JetBrains provides licenses for products for active maintainers, renewable yearly |
| Crowdin      | [![crowdin](assets/thanks/crowdin/logo.png)](https://crowdin.com/)                                                              | Crowdin provides platform for translations                                        |
| BrowserStack | [![browserstack](https://cdn.verdaccio.dev/readme/browserstack_logo.png)](https://www.browserstack.com/)                        | BrowserStack provides plan to run End to End testing for the UI                   |
| Docker       | [![docker](https://cdn.verdaccio.dev/sponsor/logo/docker/docker.png)](https://www.docker.com/community/open-source/application) | Docker offers unlimited pulls and unlimited egress to any and all users           |



### FAQ / Contact / Troubleshoot

If you encounter any issues, consider the following options. Don't hesitate to ask or check our issues database; perhaps someone has already addressed what you're looking for.

- [Blog](https://verdaccio.org/blog/)
- [Donations](https://opencollective.com/verdaccio)
- [Report an Issue](https://github.com/verdaccio/verdaccio/issues/new/choose)
- [Discussions](https://github.com/verdaccio/verdaccio/issues?q=is%3Aissue+is%3Aopen+label%3Adiscuss)
- [Chat](https://discord.gg/7qWJxBf)
- [Logos](https://verdaccio.org/docs/en/logo)
- [Docker Examples](https://github.com/verdaccio/verdaccio/tree/master/docker-examples)
- [FAQ](https://github.com/verdaccio/verdaccio/discussions/categories/q-a)

### License

Verdaccio is [MIT licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE).

The Verdaccio documentation and logos (excluding `/assets/thanks` files such as `.md`, `.png`, and `.sketch`) are [Creative Commons licensed](https://creativecommons.org/licenses/by/4.0/).
