---
'@verdaccio/ui-components': minor
'@verdaccio/config': major
'@verdaccio/types': major
---

feat: auto-detect search response shape in the Web UI and remove the `searchRemote` flag

## Breaking Changes

### Removed the `searchRemote` feature flag

The `flags.searchRemote` configuration option has been removed. The Web UI now
auto-detects the shape of the `/-/verdaccio/data/search/*` response at render
time, so no flag is required to toggle between local-only and remote-augmented
results.

**What changed:**

- `FlagsConfig.searchRemote` has been removed from `@verdaccio/types`.
- `@verdaccio/config` no longer reads or defaults `flags.searchRemote`.
- The sample `# searchRemote: true` lines in `default.yaml` / `docker.yaml`
  have been removed.
- The search UI (`@verdaccio/ui-components`) no longer consults the flag.

**Migration guide:**

Remove `flags.searchRemote` from your `config.yaml` if it is set. No other
change is required — the Web UI will render both response shapes transparently.

## UI changes

The `Search` component now consumes two response shapes without configuration:

1. **npm-style "search objects"** — entries wrapped in a `package` envelope
   with `verdaccioPkgCached` / `verdaccioPrivate` metadata. Private / cached /
   remote chips are rendered as before.
2. **Flat packument-style** — entries with `name`, `version`, `description`,
   `dist`, etc. at the top level. Chips are omitted because the shape carries
   no uplink metadata.

A new `normalizeSearchOption()` helper centralizes the shape detection and is
covered by unit tests. The `SearchResultWeb` type in `@verdaccio/types` is now
a union (`SearchResultWebFlat | SearchResultWebWrapped`) that documents both
shapes.
