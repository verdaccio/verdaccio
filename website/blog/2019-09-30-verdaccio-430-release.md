---
author: Juan Picado
authorURL: https://twitter.com/jotadeveloper
authorFBID: 1122901551
title: Release 4.3.0
---

Verdaccio keeps growing thanks to their users. This release is a minor one we do every month, further
[information about our releases can be read here](https://github.com/verdaccio/contributing/blob/master/RELEASES.md).

Furthermore, the info about the release is also available at the [GitHub releases page](https://github.com/verdaccio/verdaccio/releases/tag/v4.3.0).

We have some highlights to share:

- At this stage, Docker 🐳 pulls [have grown to **5.7 million pulls**](https://dockeri.co/image/verdaccio/verdaccio).
- We just reached **7.9k 🌟**, _would you help us to reach 10k?_ Give us your star ⭐️!
- **Blog** 🗒: Don't miss our new entry [**Managing multiple projects with Lerna and Yarn Workspaces**](https://verdaccio.org/blog/2019/09/07/managing-multiples-projects-with-lerna-and-yarn-workspaces) by [@sergiohgz](https://github.com/sergiohgz).
- **[Monorepo](https://github.com/verdaccio/monorepo)**: Along the last months we have crafted our monorepo for grouping all our ecosystem, plugin, core and tooling packages. This does not mean Verdaccio will become a monorepo, rather it will help us to grow without affecting the main repository and do easy updates or respond fast to mistakes in any release.
- **Hacktoberfest 🎃 is here**: We have prepared a guide if you want to contribute to Verdaccio, feel free to [read it](https://github.com/verdaccio/verdaccio/issues/1461) and give us feedback.

> If you 😍 Verdaccio as we do, help us to grow more by donating to the project via [OpenCollective](https://opencollective.com/verdaccio).

Thanks for supporting Verdaccio ! 👏👏👏👏.

<!--truncate-->

## Use this version {#use-this-version}

### Docker {#docker}

```bash
docker pull verdaccio/verdaccio:4.3.0
```

### npmjs {#npmjs}

```bash
npm install -g verdaccio@4.3.0
```

## Experiment Flags {#experiment-flags}

This release includes a new property named `experiments` that can be placed in the `config.yaml` and is completely optional.

We want to be able to ship new things without affecting production environments. This flag allows us to add new features and get feedback from the community that wants to use them.

The features that are under this flag might not be stable or might be removed in future releases.

## New Features {#new-features}

### [Browse web packages by version](https://github.com/verdaccio/verdaccio/issues/1457) by @juanpicado {#browse-web-packages-by-version-by-juanpicado}

When you publish a new version of your package, you want to be able to access the previous ones, that's exactly what you can do with this new release.

![verdaccio browse by version](https://cdn.verdaccio.dev/verdaccio/blog/4.3.0/version_ui_navigation.gif)

> Note the README always points to the latest release, Verdaccio does not persist the readme on each publish. This might change in the future, file a ticket if you are interested and might be considered if there is enough 👍🏻 votes.

### [npm token command support ](https://github.com/verdaccio/verdaccio/issues/1427) by @juanpicado, @Eomm and @juangabreil. {#npm-token-command-support--by-juanpicado-eomm-and-juangabreil}

The command `npm token` is really useful to generate multiple tokens. This release ships some partial support for it and is flagged as **experiment**, to enable it you must do the following in your config file.

```yaml
experiments:
  token: true
```

![npm token list](https://cdn.verdaccio.dev/verdaccio/blog/4.3.0/token_list.png)

You can find further technical information [here](https://github.com/verdaccio/verdaccio/pull/1427).

### Other updates {#other-updates}

- (Docker) Node.js update to v10.16.3 [#1473](https://github.com/verdaccio/verdaccio/issues/1473) by [@juanpicado](https://github.com/juanpicado)
- (Logging) Ensure every log file has at least one record [#1414](https://github.com/verdaccio/verdaccio/issues/1414) by [@mlucool](https://github.com/mlucool)
- **UI**: fix: correctly load font files - closes [#134](https://github.com/verdaccio/ui/pull/134) by [@DanielRuf](https://github.com/DanielRuf)
- **UI**: fix(ui): fix the hover effect on the packageItem's author area [#137](https://github.com/verdaccio/ui/pull/137) by [@FilipMessa](https://github.com/FilipMessa)
- **UI**: chore: pumped mui version [#131](https://github.com/verdaccio/ui/pull/131) by [@priscilawebdev](https://github.com/priscilawebdev)
- **UI**: fix: sidebar view on small screens [#136](https://github.com/verdaccio/ui/pull/136) by [@juanpicado](https://github.com/juanpicado)
- **Monorepo**: fix(security): Cross-site Scripting (XSS) for readme [#145](https://github.com/verdaccio/monorepo/pull/145) by [@juanpicado](https://github.com/juanpicado)
- **Monorepo**: remove eslint warnings [#112](https://github.com/verdaccio/monorepo/pull/112) by [@sergiohgz](https://github.com/sergiohgz)
- **Monorepo**: chore: use Alpine image in DevContainers [#100](https://github.com/verdaccio/monorepo/pull/100) by [@sergiohgz](https://github.com/sergiohgz)
- **Monorepo**: ci: publish every commit in a temporal in-memory registry [#74](https://github.com/verdaccio/monorepo/pull/74) by [@sergiohgz](https://github.com/sergiohgz)

# Verdaccio v3

Verdaccio 3 is still under our **security maintenance state**, thus we just shipped a minor update `v3.13.1`.

- Docker image updated to Node.js **v10.16.3**
- Update core dependencies

> We update as much as possible without breaking the current implementation, thus storage or htpasswd are not part of this update.

## Use this version {#use-this-version-1}

### Docker {#docker-1}

```bash
docker pull verdaccio/verdaccio:3.13.1
```

### npmjs {#npmjs-1}

```bash
npm install -g verdaccio@3.13.1
```

or

```bash
npm i -g verdaccio@previous
```
