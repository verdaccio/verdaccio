---
'@verdaccio/cli': minor
---

feat(cli): build the `--info` environment report locally, add `--mask`

The `--info` command now builds its environment report locally (dropping the `envinfo`
dependency), no longer lists browsers, and adds a Verdaccio section with the config path,
whether the storage is the built-in local filesystem or a storage plugin, and the
configured auth/middleware/filter plugins. A new `--info --mask` flag obscures every file
path (binary, config and storage) by replacing each directory with `**` while keeping the
structure and the final name; without it, the report ends with a hint that the flag exists.
On Windows the binary/Docker/global-package detection (which relies on `which` and
unshimmed executables) is skipped rather than printing broken entries; the OS, CPU and
Verdaccio sections still show.
