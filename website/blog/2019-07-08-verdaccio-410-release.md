---
author: Juan Picado
authorURL: https://twitter.com/jotadeveloper
authorFBID: 1122901551
title: Release 4.1.0
---

Verdaccio keeps growing thanks to their users. This release is a minor one we do every month, for further
[information about our releases can be read here](https://github.com/verdaccio/contributing/blob/master/RELEASES.md).

Furthermore, the info about the release is also available [at GitHub releases page](https://github.com/verdaccio/verdaccio/releases/tag/v4.1.0).

We have some highlights to share:

- At this stage, Docker downloads [have grown to 4.8 million pulls](https://dockeri.co/image/verdaccio/verdaccio).
- **Angular CLI** just started to uses [Verdaccio 4 for E2E testing](https://twitter.com/jotadeveloper/status/1146415913396318208). For
  further read about this topic, [check our docs](https://verdaccio.org/docs/en/e2e).
- This release **has been fully developed by contributors**, kudos to them.
- We just reached 7k stars, **would you help us to reach 10k?** Give us your star ⭐️!
- We have a new [Security Policy Document](https://github.com/verdaccio/verdaccio/security/policy) 🛡, helps us to keep Verdaccio secure for their users.

> If you 😍 Verdaccio as we do, helps us to grow more donating to the project via [OpenCollective](https://opencollective.com/verdaccio).

Thanks for support Verdaccio ! 👏👏👏👏.

<!--truncate-->

## Use this version {#use-this-version}

### Docker {#docker}

```bash
docker pull verdaccio/verdaccio:4.1.0
```

### npmjs {#npmjs}

```bash
npm install -g verdaccio@4.1.0
```

## New Features {#new-features}

### [Filter plugin for packages](https://github.com/verdaccio/verdaccio/pull/1161) by @mlucool {#filter-plugin-for-packages-by-mlucool}

Verdaccio now support plugin filters, we are just starting with filter metadata.

> It gets a current copy of a package metadata and may choose to modify it as required.
> For example, this may be used to block a bad version of a package or
> add a time delay from when new packages can be used from your
> registry. Errors in a filter will cause a 404, similar to upLinkErrors
> as it is not safe to recover gracefully from them.

The configuration would looks like

```yaml
filters:
  storage-filter-blackwhitelist:
    filter_file: /path/to/file
```

The current API for the plugin is

```javascript
interface IPluginStorageFilter<T> extends IPlugin<T> {
  filter_metadata(packageInfo: Package): Promise<Package>;
}
```

This system might be extended in the future, we are trying this approach at this stage.

### [parse YAML/JSON/JS config file](https://github.com/verdaccio/verdaccio/pull/1258) by @honzahommer {#parse-yamljsonjs-config-file-by-honzahommer}

Now, Verdaccio is able to understand JSON format for configuration files.

```bash
verdaccio --config /myPath/verdaccio.json
```

### [New CLI command `verdaccio --info`](https://github.com/verdaccio/verdaccio/pull/1365) by @jamesgeorge007 {#new-cli-command-verdaccio---info-by-jamesgeorge007}

The new `verdaccio --info` command will display information of your environment, this sort of information is handy in order to report any bug.

```bash
$ verdaccio --info

Environment Info:

  System:
    OS: macOS 10.14
    CPU: (4) x64 Intel(R) Core(TM) i5-6267U CPU @ 2.90GHz
  Binaries:
    Node: 10.15.0 - ~/.nvm/versions/node/v10.15.0/bin/node
    Yarn: 1.16.0 - ~/.nvm/versions/node/v10.15.0/bin/yarn
    npm: 6.9.0 - ~/.nvm/versions/node/v10.15.0/bin/npm
  Virtualization:
    Docker: 19.03.0 - /usr/local/bin/docker
  Browsers:
    Chrome: 75.0.3770.100
    Firefox: 67.0.3
    Safari: 12.0
  npmGlobalPackages:
    verdaccio: 4.0.0
```
