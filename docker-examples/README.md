# Docker + Kubernetes Examples

A collection of runnable Docker and Kubernetes examples for Verdaccio. Each
example is self-contained — `cd` into its folder and follow its `README.md`.

> Examples are demonstrative; contributions for other use cases are welcome.

## Versions

Examples are grouped by the major Verdaccio version they target. Pick the set
that matches the image you run.

| Set                         | Verdaccio image                | Notes                                                        |
| --------------------------- | ------------------------------ | ------------------------------------------------------------ |
| [v7 examples](v7/README.md) | `verdaccio/verdaccio:7.x-next` | Current (Version Next / v9 dev line uses the same patterns). |
| [v6 examples](v6/README.md) | `verdaccio/verdaccio:6`        | Previous stable.                                             |

## What you can find

### v7 ([details](v7/README.md))

- **[Local storage volume](v7/docker-local-storage-volume/README.md)** — minimal
  setup that persists `storage/` and `conf/` via bind mounts.
- **Reverse proxy**
  - **[Nginx](v7/reverse_proxy/nginx/README.md)** — root path (`/`) and relative
    path (`/verdaccio/`), including a self-signed **SSL + HTTP/2** variant.
  - **[Apache (httpd:2.4)](v7/reverse_proxy/apache/README.md)** — `mod_proxy`
    reverse proxy.
  - **[HTTPS Portal](v7/reverse_proxy/https-portal/README.md)** — automated
    HTTPS (Let's Encrypt / self-signed) via `https-portal`.
- **Plugins** (legacy plugin API, still supported on v7)
  - **[Install a published plugin](v7/plugins/docker-build-install-plugin/README.md)** —
    `verdaccio-auth-memory@next-7` installed in a builder stage.
  - **[Load a local plugin](v7/plugins/docker-local-plugin/README.md)** — a
    zero-dependency dummy auth plugin that always grants access.
- **Kubernetes**
  - **[Helm](v7/kubernetes/helm/README.md)** — deploy with the official
    [Verdaccio Helm chart](https://github.com/verdaccio/charts).
- **Amazon S3** — not bundled; use the dedicated
  [`verdaccio/verdaccio-aws-s3-storage`](https://github.com/verdaccio/verdaccio-aws-s3-storage)
  plugin.

### v6 ([details](v6/README.md))

The same local-storage, nginx, apache, https-portal and plugin examples as v7,
plus:

- **[Amazon S3 (LocalStack)](v6/amazon-s3-docker-example/README.md)** — S3
  storage backed by a local LocalStack.
- **[GitHub OAuth UI](v6/verdaccio-github-oauth-ui/README.md)** — login via the
  `verdaccio-github-oauth-ui` plugin.

## Reverse proxy notes

The proxy examples set the headers Verdaccio needs to resolve the public URL —
`Host` and `X-Forwarded-Proto` — and raise the upload limit
(`client_max_body_size 0;` for nginx, `LimitRequestBody 0` for Apache) so
`npm publish` of large tarballs does not fail with HTTP `413`. See the
[reverse proxy documentation](https://verdaccio.org/docs/reverse-proxy) for the
full reference.

## Default credentials

The examples that ship an `htpasswd` file use:

- **Username:** `dummyuser`
- **Password:** `dummyuser`

## External resources

- **Helm chart:** <https://github.com/verdaccio/charts>
- [Verdaccio examples for Google Cloud and K8s setups](https://github.com/papezt/verdaccio-examples)

### Articles

- [Kubernetes private npm registry](https://medium.com/@tompape/kubernetes-private-npm-registry-fb5f450fa611)
- [Déployer Verdaccio sur rancher avec un helm](https://tommygingras.com/deployer-verdaccio-sur-rancher-avec-un-helm/)
