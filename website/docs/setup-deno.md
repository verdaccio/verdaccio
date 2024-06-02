---
id: setup-deno
title: 'deno'
---

- [Example repository](https://github.com/juanpicado/verdaccio-with-deno)

# deno {#deno}

The minimum supported [deno](https://deno.com/blog/v1.44) version is >1.44.0

## Using registry for a specific project {#specific}

Create a `.npmrc` file and set

```bash
registry=http://localhost:4873
```

On run `deno` command the installation will be done from the local registry.

## Troubleshooting {#troubleshooting}

### Clear cache with `deno`

```bash
> deno info

DENO_DIR location: /Users/user/Library/Caches/deno
Remote modules cache: /Users/user/Library/Caches/deno/deps
npm modules cache: /Users/user/Library/Caches/deno/npm
Emitted modules cache: /Users/user/Library/Caches/deno/gen
Language server registries cache: /Users/user/Library/Caches/deno/registries
Origin storage: /Users/user/Library/Caches/deno/location_data
```

And remove the local cache for th specific registry you have set (by default is `localhost_4873`)

```bash
// for MAC OS users (other OS may vary)
rm -Rf /Users/user/Library/Caches/deno/npm/localhost_4873
```

> It's not clear if there is a better way to do this, please refer to the [following discussion](https://github.com/denoland/deno/discussions/9419) for more information.
