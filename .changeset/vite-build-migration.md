---
'@verdaccio/api': major
'@verdaccio/auth': major
'@verdaccio/cli': major
'@verdaccio/config': major
'@verdaccio/core': major
'@verdaccio/file-locking': major
'@verdaccio/hooks': major
'@verdaccio/loaders': major
'@verdaccio/local-storage': major
'@verdaccio/logger': major
'@verdaccio/middleware': major
'@verdaccio/node-api': major
'@verdaccio/proxy': major
'@verdaccio/search': major
'@verdaccio/search-indexer': major
'@verdaccio/server': major
'@verdaccio/signature': major
'@verdaccio/store': major
'@verdaccio/tarball': major
'@verdaccio/test-helper': major
'@verdaccio/ui-components': major
'@verdaccio/ui-i18n': major
'@verdaccio/url': major
'@verdaccio/web': major
'verdaccio': major
'verdaccio-audit': major
'verdaccio-auth-memory': major
'verdaccio-htpasswd': major
'verdaccio-memory': major
---

Replace Babel and esbuild build pipeline with Vite 8 across all packages. All packages now output dual ESM (.mjs) and CJS (.js) formats with TypeScript declarations generated via vite-plugin-dts. Includes shared build config at vite.lib.config.mjs, proper exports field in all package.json files, and fixes for type-only re-exports required by Rollup's stricter module analysis.
