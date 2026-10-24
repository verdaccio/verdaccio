# @verdaccio/admin-cli

## 9.0.0-next-9.38

### Patch Changes

- Updated dependencies [d8ff951]
  - @verdaccio/config@9.0.0-next-9.38
  - @verdaccio/auth@9.0.0-next-9.38
  - @verdaccio/store@9.0.0-next-9.38
  - @verdaccio/core@9.0.0-next-9.38
  - @verdaccio/logger@9.0.0-next-9.38

## 9.0.0-next-9.37

### Patch Changes

- 8a6e1a1: Update runtime dependencies across the registry and run the official Docker image on Node.js 26.
  
  The Docker image now builds and runs on `node:26-alpine`, the Node.js line that becomes Active LTS on 28 October 2026; Node.js 24 entered maintenance on 20 October. Operators who extend the image should check that any native addons they install support Node.js 26.
  
  The uplink, notification and audit HTTP client moves to `got` 16. Verdaccio does not use the options removed in that release (the HTTP/2 agent slot, `dnsCache` and the old `auth` stubs), so uplink configuration, `agent_options` and `https_proxy` behave as before. Uplink responses with an error status, such as a 404 for a package the uplink does not have, keep appearing in the `http` log as they did with `got` 15. The CLI moves to `chalk` 6 and the web UI's README renderer to `marked` 18.
  
  The remaining updates are minor or patch releases: `express` 5.3.0 in every package that serves HTTP, `express-rate-limit` 8.7.1, `pino` 10.4.0, `js-yaml` 5.5.0, `tar-stream` 3.2.2, `sanitize-filename` 1.6.4, `process-warning` 5.1.1 and `memfs` 4.80.0. No configuration changes are required.
- Updated dependencies [c7bf0d0]
- Updated dependencies [4a483d0]
- Updated dependencies [c2eafec]
- Updated dependencies [8a6e1a1]
- Updated dependencies [0fc3051]
- Updated dependencies [0fc3051]
  - @verdaccio/store@9.0.0-next-9.37
  - @verdaccio/core@9.0.0-next-9.37
  - @verdaccio/auth@9.0.0-next-9.37
  - @verdaccio/config@9.0.0-next-9.37
  - @verdaccio/logger@9.0.0-next-9.37

## 9.0.0-next-9.36

### Patch Changes

- Updated dependencies [5009e4d]
  - @verdaccio/auth@9.0.0-next-9.36
  - @verdaccio/config@9.0.0-next-9.36
  - @verdaccio/store@9.0.0-next-9.36
  - @verdaccio/core@9.0.0-next-9.36
  - @verdaccio/logger@9.0.0-next-9.36

## 9.0.0-next-9.35

### Patch Changes

- Updated dependencies [d733daf]
- Updated dependencies [1693358]
  - @verdaccio/store@9.0.0-next-9.35
  - @verdaccio/core@9.0.0-next-9.35
  - @verdaccio/auth@9.0.0-next-9.35
  - @verdaccio/config@9.0.0-next-9.35
  - @verdaccio/logger@9.0.0-next-9.35

## 9.0.0-next-9.34

### Patch Changes

- Updated dependencies [83eb46c]
- Updated dependencies [0cac607]
- Updated dependencies [b6cc475]
- Updated dependencies [83eb46c]
- Updated dependencies [31e18e8]
- Updated dependencies [83eb46c]
  - @verdaccio/store@9.0.0-next-9.34
  - @verdaccio/core@9.0.0-next-9.34
  - @verdaccio/auth@9.0.0-next-9.34
  - @verdaccio/config@9.0.0-next-9.34
  - @verdaccio/logger@9.0.0-next-9.34

## 9.0.0-next-9.33

### Patch Changes

- Updated dependencies [ed518e8]
- Updated dependencies [950fd9f]
- Updated dependencies [73c78e3]
  - @verdaccio/store@9.0.0-next-9.33
  - @verdaccio/config@9.0.0-next-9.33
  - @verdaccio/logger@9.0.0-next-9.33
  - @verdaccio/auth@9.0.0-next-9.33
  - @verdaccio/core@9.0.0-next-9.33

## 9.0.0-next-9.32

### Minor Changes

- 34cd0fb: feat(admin-cli): new `@verdaccio/admin-cli` package with an experimental `verdaccio-admin storage` command group
  
  A new package that ships the `verdaccio-admin` binary, home of the operator-facing
  maintenance commands, kept separate from the `verdaccio` binary that runs the server.
  
  It adds an experimental `storage` command group with `cache`, `view`, `doctor`,
  `migrate`, `backup` and `stats` subcommands for inspecting, cleaning, repairing, moving,
  snapshotting and measuring the storage. The group is experimental and prints a yellow
  notice on every run.
  
  These commands target the filesystem storage backend. The ones that read the on-disk
  layout — `doctor`, `stats`, `migrate` and `backup` — refuse to run with a clear message
  when the configured storage plugin is not filesystem-based (e.g. S3/GCS/Azure); `cache`
  and `view` still work but omit disk sizes there.
  
  The per-package commands (`cache`, `view`, `doctor`) are gated by the same package-access
  ACL the registry enforces. The operator logs in with `-u,--user` (password prompted, or
  `--password`), validated offline against the configured auth plugin (e.g. htpasswd), or
  passes a JWT `--token`, or acts anonymously; `allow_access`/`allow_unpublish` then decide
  what is listed or removable. The whole-storage commands (`migrate`, `backup`, `stats`) are
  local admin operations governed by filesystem permissions — they act on the entire storage
  and do not take the login options. `storage cache`
  walks the storage on disk (cached packages are not tracked in the private database) and
  lists the uplink-cached packages the operator can read. `--clean` selects the packages
  the operator can unpublish and, after an interactive confirmation, deletes each one
  fully — cached tarballs, `package.json`, the folder, an emptied `@scope` directory and
  the database entry — leaving
  locally published packages untouched. Use `--dry-run` to preview only, or `-y,--yes` to
  skip the prompt in scripts.
  
  `storage doctor` scans the storage and reports how many problems it found — leftover
  temp files and unreferenced `.tgz` tarballs (fixable), plus unreadable manifests,
  stale `_distfiles` bookkeeping pointing at a host that is no longer a configured uplink,
  and — for locally published packages only — missing tarballs (report only; cached
  packages fetch tarballs on demand, so a missing one there is normal). With `--fix` it removes the fixable files (gated by
  `unpublish`) after showing the count and asking for confirmation.
  
  `storage view` opens an interactive browser of the cached packages the operator can
  read: page through them, filter by name, inspect a package (versions, tarballs on disk
  and total size, stale distfile warnings) and delete one (gated by `unpublish`, with
  confirmation).
  
  `storage migrate --to <dir>` copies the storage (packages plus the internal state — the
  private database, the token store and staged publishes) to another directory. The source
  is the configured storage by default (each package copied from its authoritative on-disk
  location, honouring per-package `storage` overrides), or an explicit `--from <dir>` (a pure
  directory-to-directory copy that needs no config). Packages already in the destination are
  resolved interactively (overwrite/skip/all — skip is the default; non-TTY runs skip every
  conflict and hint at `--overwrite`), and overwriting replaces the destination folder, so
  stale files that only existed there do not survive; the replacement is staged through a
  temp sibling and swapped in only when complete, so a failed copy never destroys the
  existing destination package, and a source that resolves to the same directory as its
  destination is refused. The registry state is migrated even when the source has no
  packages (or every conflict is skipped). An **existing destination database, secret
  or token store is preserved, never overwritten** — a merge does not corrupt the
  destination's index or invalidate its tokens.
  
  `storage backup <location>` copies the whole storage tree to a fresh (empty) location as a
  complete snapshot (packages, private database, token store and `.stage`), refusing to write
  into a non-empty directory or a location that is not a directory.
  
  The interactive password prompt (`-u,--user` without `--password`) aborts cleanly when the
  prompt is closed without input (Ctrl+D / Ctrl+C) instead of hanging the command.
  
  Destructive operations warn to run with the server stopped, and `doctor` ignores temp files
  younger than an hour so it does not delete an in-flight write.
  
  `storage stats` prints a table with the item counts (private, cached and staged — the
  hidden `.stage` namespace is scanned separately), the tarball count and the disk usage
  (total and per category).

### Patch Changes

- 8c21fa8: fix(admin-cli): test on windows
- Updated dependencies [107c4d3]
- Updated dependencies [34cd0fb]
- Updated dependencies [59f1350]
- Updated dependencies [f3f8976]
- Updated dependencies [89a7362]
- Updated dependencies [3618123]
- Updated dependencies [b27212f]
- Updated dependencies [cbfcfd2]
- Updated dependencies [a4e2da0]
- Updated dependencies [73415bb]
- Updated dependencies [107c4d3]
  - @verdaccio/logger@9.0.0-next-9.32
  - @verdaccio/config@9.0.0-next-9.32
  - @verdaccio/core@9.0.0-next-9.32
  - @verdaccio/store@9.0.0-next-9.32
  - @verdaccio/auth@9.0.0-next-9.32
