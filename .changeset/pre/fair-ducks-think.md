---
'@verdaccio/middleware': minor
'@verdaccio/proxy': minor
'@verdaccio/server': minor
'@verdaccio/config': minor
'@verdaccio/types': minor
---

fix: static files returning 404 after Express 5 upgrade

- fix(middleware): resolve static file 404s caused by `send@1.x` dotfile detection on absolute paths containing dot-prefixed directories (e.g. `.nvm`). Use `res.sendFile(filename, { root })` instead of absolute paths
- fix(middleware): handle Express 5 `{*all}` wildcard returning arrays instead of strings for `req.params`
- feat(middleware): add configurable `dotfiles` middleware to block dotfile path requests (`.env`, `.git/config`, etc.) with deny/ignore/allow policies
- feat(middleware): add `hideStaticLogs` option to `log()` middleware to suppress `/-/static/` request logging (defaults to true)
- fix(proxy): resolve `http-errors` deprecation warning for non-error status codes (304)
- feat(config): add `server.dotfiles` and `server.hideStaticLogs` options to configuration schema with secure defaults
- chore: add `pnpm global:install` script for testing local builds globally
- ci: add smoke test workflow for local builds verifying version, web UI rendering, static assets, and package installation
