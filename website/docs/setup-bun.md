---
id: setup-bun
title: 'bun'
---

# bun {#bun}

- [Example repository](https://github.com/juanpicado/verdaccio-with-bun)

## Using registry for a specific project {#specific}

Create a `bunfig.toml` file at the root of the project and set

```toml
[install]
registry = "http://localhost:4873"

```

On run `bun install` command the installation will be done from the local registry.

To enable authenticated access to the registry, you can set the token in the `bunfig.toml` file.

```toml
[install.scopes]

# as an object with token
"@myorg3" = { token = "$npm_token", url = "https://localhost:4873/" }
```

Bun provides other ways to configure the registry, you can find more information in the official documentation.

- [Override the default npm registry for bun install](https://bun.sh/guides/install/custom-registry)
- [Configure a private registry for an organization scope with bun install](https://bun.sh/guides/install/registry-scope)

## Troubleshooting {#troubleshooting}

### Clear cache with `bun`

To remove the cache, seems that you need to remove the `bun.lock` file, this file is created when you run `bun install` and it's located in the root of the project.

> It may be a better way to do this, please share new solutions.

```bash
rm bun.lockb
```
