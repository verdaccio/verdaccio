# Loading a local plugin with Docker

This example shows how to bundle a **local** Verdaccio plugin into a custom
Docker image — no npm registry involved.

The plugin here, [`verdaccio-docker-dummy`](./plugins/verdaccio-docker-dummy),
is a tiny **dummy auth plugin** that **always grants access**: every
`authenticate` / `allow_access` / `allow_publish` / `allow_unpublish` call
returns `true`. It implements the classic (legacy) callback-based auth API,
which Verdaccio 7 (`7.x-next`) still supports.

> ⚠️ The dummy plugin lets anyone log in and publish. It is for demonstration
> only — never use it in production.

Because the plugin has **no dependencies**, it only needs to be copied into the
image's `plugins` folder — there is no build/install step. (If your plugin has
dependencies, install them in a builder stage as shown in the
[`docker-build-install-plugin`](../docker-build-install-plugin/README.md)
example.)

## How it is wired

- `plugins/verdaccio-docker-dummy/` — the local plugin (a single `index.js` + `package.json`).
- `docker.yaml` — enables it under `auth: { docker-dummy: ... }`. The config key
  `docker-dummy` resolves to the package `verdaccio-docker-dummy` inside the
  `plugins` directory.
- `Dockerfile` — copies the plugin into `/verdaccio/plugins/verdaccio-docker-dummy`
  with the right ownership (`--chown=$VERDACCIO_USER_UID:root`) so Verdaccio
  picks it up.

## Run it

Build the image:

```bash
docker build -t verdaccio/verdaccio:local .
```

Run it:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio:local
```

Then log in with **any** username/password — the dummy plugin accepts everyone:

```bash
npm adduser --registry http://localhost:4873
npm publish --registry http://localhost:4873
```

## The Dockerfile

```dockerfile
FROM verdaccio/verdaccio:7.x-next
USER root
COPY docker.yaml /verdaccio/conf/config.yaml
COPY --chown=$VERDACCIO_USER_UID:root \
  plugins/verdaccio-docker-dummy \
  /verdaccio/plugins/verdaccio-docker-dummy
USER $VERDACCIO_USER_UID
```
