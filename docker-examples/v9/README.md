# Verdaccio 9 examples

Examples targeting `verdaccio/verdaccio:nightly-master`, the **experimental**
9.x line. New features land here first, before reaching 7.x.

> Experimental releases are not production ready. They exist so features can be
> tried and reported on before they settle.

Everything in the [v7 examples](../v7/README.md) — local storage volume, reverse
proxies, plugins, Kubernetes — applies here too; only the image tag differs.
This folder holds what is specific to 9.x.

## Examples

- **[Staged publishing and two-factor](staged-publishing-and-2fa/README.md)** —
  the `stage` and `tfa` flags enabled, showing the review gate (`npm stage`), the
  one-time password flow (`npm profile enable-2fa`), and how a CI pipeline
  publishes when both are on.

## Default credentials

- **Username:** `dummyuser`
- **Password:** `dummyuser`
