---
'@verdaccio/auth': major
'verdaccio-htpasswd': major
'verdaccio-audit': major
'@verdaccio/server': major
'@verdaccio/cli-standalone': major
---

feat: standalone registry with no dependencies

## Usage

To install a server with no dependencies

```bash
npm install -g @verdaccio/standalone
```

with no internet required

```bash
npm install -g ./tarball.tar.gz
```

Bundles htpasswd and audit plugins.

### Breaking Change

It does not allow anymore the `auth` and `middleware` property at config file empty,
it will fallback to those plugins by default.
