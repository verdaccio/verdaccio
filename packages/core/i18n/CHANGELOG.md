# @verdaccio/ui-i18n

## 10.0.0-next-9.2

### Major Changes

- 52a6520: Replace Babel and esbuild build pipeline with Vite 8 across all packages. All packages now output dual ESM (.mjs) and CJS (.js) formats with TypeScript declarations generated via vite-plugin-dts. Includes shared build config at vite.lib.config.mjs, proper exports field in all package.json files, and fixes for type-only re-exports required by Rollup's stricter module analysis.

## 10.0.0-next-9.1

### Major Changes

- 325c584: feat: migrate to vite

## 10.0.0-next-9.0

### Major Changes

- 7f80af5: chore: bump package

## 8.0.0-next-8.14

### Minor Changes

- b5eccfc: feat: remove rematch refactor ui

## 8.0.0-next-8.13

### Patch Changes

- 626ae6a: feat: web v1 login frontend (experimental)

## 8.0.0-next-8.12

### Patch Changes

- e4a1539: chore: package.json maintenance
- dbe6a76: fix(i18n): avoid fallback for en-us

## 8.0.0-next-8.11

### Patch Changes

- b6e9f46: fix: ignore duplicted files
