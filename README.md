![verdaccio logo](https://cdn.verdaccio.dev/readme/verdaccio@2x.png)

# Verdaccio - 8.x Branch

> **This is a temporary branch for the `8.x` release line.**
> The `6.x` branch is the current stable version and only accepts **bug fixes** and **security patches**.
> Active development happens on `master`.

[Verdaccio](https://verdaccio.org/) is a simple, **zero-config-required local private npm registry**.
No need for an entire database just to get started! Verdaccio comes out of the box with
**its own tiny database**, and the ability to proxy other registries (eg. npmjs.org),
caching the downloaded modules along the way.
For those looking to extend their storage capabilities, Verdaccio
**supports various community-made plugins to hook into services such as Amazon's s3,
Google Cloud Storage** or create your own plugin.

[![Verdaccio Home](https://img.shields.io/badge/Homepage-Verdaccio-405236?style=flat)](https://verdaccio.org)
[![MIT License](https://img.shields.io/github/license/verdaccio/verdaccio?label=License&color=405236)](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)
[![Verdaccio Latest](https://img.shields.io/npm/v/verdaccio?label=Latest%20Version&color=405236)](https://github.com/verdaccio/verdaccio)

[![Documentation](https://img.shields.io/badge/Help-Verdaccio?style=flat&logo=Verdaccio&label=Verdaccio&color=cd4000)](https://verdaccio.org/docs)
[![Discord](https://img.shields.io/badge/Chat-Discord?style=flat&logo=Discord&label=Discord&color=cd4000)](https://discord.com/channels/388674437219745793)

## Branch Strategy

| Branch   | Purpose                           | Accepts                          |
| -------- | --------------------------------- | -------------------------------- |
| `master` | Active development (next major)   | Features, bug fixes, security    |
| `8.x`    | Current release line              | Bug fixes, security patches      |
| `6.x`    | Legacy stable (bug/security only) | Bug fixes, security patches only |

## License

Verdaccio is [MIT licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)
