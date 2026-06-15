# Verdaccio 7 with HTTPS Portal

Run `verdaccio/verdaccio:7.x-next` behind a fully automated HTTPS server powered
by nginx + Let's Encrypt, using
[https-portal](https://github.com/SteveLTN/https-portal). TLS certificates are
issued and renewed automatically — no extra configuration required.

## Prerequisites

This is a local setup, so map the example domain to localhost in your hosts
file (`/etc/hosts` on macOS/Linux):

```
127.0.0.1       localhost
127.0.0.1       example.com
```

The compose file sets `STAGE: local`, so https-portal generates a **self-signed**
certificate (no real Let's Encrypt calls). For a public deployment, set
`STAGE: production` and use a real domain.

## Usage

Start the containers in the background:

```bash
docker compose up -d --build
```

Force a full rebuild/recreate:

```bash
docker compose up -d --build --force-recreate
```

Stop everything:

```bash
docker compose down
```

Publish from your project:

```bash
npm publish --registry https://example.com
```

## npm and self-signed certificates

Because the local certificate is self-signed, npm may reject it. Either trust
the generated certificate, or (for local testing only) disable strict SSL:

```bash
npm config set strict-ssl false
```

## Login

A default user is provided for these examples:

- Username: `dummyuser`
- Password: `dummyuser`
