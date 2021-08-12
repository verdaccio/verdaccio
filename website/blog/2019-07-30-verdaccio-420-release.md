---
author: Juan Picado
authorURL: https://twitter.com/jotadeveloper
authorFBID: 1122901551
title: Release 4.2.0
---

Verdaccio keeps growing, thanks to their users. This release is a minor one we do every month, for further
[information about our releases, it can be read here](https://github.com/verdaccio/contributing/blob/master/RELEASES.md).

We have some highlights to share:

- At this stage, Docker downloads [have grown to 5.1 million pulls](https://dockeri.co/image/verdaccio/verdaccio).
- **New Verdaccio Monorepo** development has begun early this month, we are migrating small repositories, plugins and other tools to create a unique ecosystem, [feel free to contribute](https://github.com/verdaccio/monorepo). This first steps are developed by [**@sergiohgz**](https://github.com/sergiohgz) with the contributions of [@griffithtp](https://github.com/griffithtp).
- We finally migrated all repositories to **Typescript**, we do not support Flow types anymore.

If you 😍 Verdaccio as we do, helps us to grow more donating to the project via [OpenCollective](https://opencollective.com/verdaccio), this project is addressed by **voluntaries**, help us to be sustainable.

Thanks for support Verdaccio ! 👏👏👏👏.

<!--truncate-->

## Use this version {#use-this-version}

### Docker {#docker}

```bash
docker pull verdaccio/verdaccio:4.2.0
```

### npmjs {#npmjs}

```bash
npm install -g verdaccio@4.2.0
```

## New Features {#new-features}

### Typescript migration by @juanpicado, @priscilawebdev and @griffithtp {#typescript-migration-by-juanpicado-priscilawebdev-and-griffithtp}

Now, Verdaccio is built entirely in **Typescript**, the last phase was convert the [main project](https://github.com/verdaccio/verdaccio/issues/1166).

The UI-Theme was also [migrated to Typescript](https://github.com/verdaccio/ui/pull/47) by [**@priscilawebdev**](https://github.com/priscilawebdev) with the help of [**@griffithtp**](https://github.com/verdaccio/ui/pulls?q=is%3Apr+author%3Agriffithtp) for finishing the refactor and make ESLint looks great again.

### audit module doesn't support strict_ssl flag by @dfrencham {#audit-module-doesnt-support-strict_ssl-flag-by-dfrencham}

There are some scenarios where Verdaccio runs behind company proxy with self-certificates. Now the audit middleware supports the flag `strict_ssl`, replicating the same [feature availabe in uplinks](https://verdaccio.org/docs/en/uplinks#configuration).

```
middlewares:
  audit:
    enabled: true
    strict_ssl: true # optional, defaults to true
```

## Development {#development}

### [prevent secrets from leaking to source control](https://github.com/verdaccio/verdaccio/pull/1373) by @lirantal {#prevent-secrets-from-leaking-to-source-control-by-lirantal}

Adds support through [detect-secrets](https://github.com/Yelp/detect-secrets) which wraps Yelp's generic detect-secrets tool, to test for secrets being committed to source control using the pre-commit Git hook the project already has, and as a result prevent secrets like passwords, tokens and others to leak into source control.

The detect-secrets npm package will try different methods of invoking the detect-secrets-hook tool to run the secrets test for each file, and if it isn't able to find it will silently fail to not interrupt developer workflow. In a future re-visit of this capability we can update this to be a breaking change and fail the commit (or perhaps fail the CI, which might be a bit late, but better than never).

### [storage plugins can throw http status codes](https://github.com/verdaccio/verdaccio/pull/1360) by @juanpicado {#storage-plugins-can-throw-http-status-codes-by-juanpicado}

The storage plugins were forced to return some specific error codes that are not part of Node.js. Now we allow storage plugins to return the same error codes that Verdaccio returns to the Node Package Manager. Read more context in the PR.

## Bugs {#bugs}

- [**Download button is not displayed if the tarball dist URI has localhost as domain**](https://github.com/verdaccio/ui/issues/76) by @juanpicado
- [**download button hidden for localhost**](https://github.com/verdaccio/ui/pull/101) by @griffithtp
