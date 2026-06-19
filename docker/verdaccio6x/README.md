# Verdaccio 6.x local test image

Builds a Docker image of **Verdaccio 6.x** where every `@verdaccio/*` package is
replaced by the version **built from this repository**, so you can test local
changes (e.g. the package-filter search fix, issue #5837) end-to-end before
publishing.

## How it works

1. `prepare.mjs` builds all workspace packages and runs `pnpm pack` on each
   publishable `@verdaccio/*` / `verdaccio-*` package. `pnpm pack` rewrites
   `workspace:*` specifiers to real versions, producing the exact npm artifact.
2. It writes `dist/package.json` (declaring `verdaccio@^6`) and
   `dist/pnpm-workspace.yaml` holding a pnpm `overrides` map that points every
   package at its local tarball (`dist/tarballs/*.tgz`) — same config style as the
   repo. `nodeLinker: hoisted` keeps a flat `node_modules` so verdaccio resolves
   every plugin like a classic install.
3. The `Dockerfile` (node:24-alpine + corepack pnpm) runs `pnpm install`, so
   verdaccio@6 is installed with its whole `@verdaccio/*` tree forced to the local
   builds. `docker-compose.yml` wires up the build, port `4873`, and a storage volume.

## Usage

```bash
# Build AND run via docker compose (packs local packages, builds, then starts)
pnpm verdaccio            # http://localhost:4873

# Or run the steps separately:
pnpm verdaccio:build      # prepare context + docker compose build
pnpm verdaccio:run        # docker compose up (already-built image)
pnpm verdaccio:down       # docker compose down
```

Then point a client at it:

```bash
npm --registry http://localhost:4873 search babel
npm --registry http://localhost:4873 install lodash
```

## Debugging

The image runs with the Node inspector exposed and verdaccio's `debug()` logs on:

- **Inspector**: `--inspect` on `:9229` (no break on start) — attach from
  `chrome://inspect` or VS Code at `localhost:9229`.
- **DEBUG logs**: defaults to the whole `verdaccio:*` namespace. Override per run:

  ```bash
  DEBUG='verdaccio:plugin:package-filter*' pnpm verdaccio   # just the package-filter
  DEBUG='*' pnpm verdaccio                                  # everything
  ```

## Options

- `SKIP_BUILD=1 pnpm verdaccio` — skip the workspace build, pack existing output.
- `VERDACCIO_VERSION=6.5.2 pnpm verdaccio` — pin a specific verdaccio 6.x release.

Edit `config.yaml` to change the `package-filter` rules (or any other config); it
is copied into the image at build time.
