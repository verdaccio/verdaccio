---
'@verdaccio/admin-cli': minor
---

feat(admin-cli): new `@verdaccio/admin-cli` package with an experimental `verdaccio-admin storage` command group

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
resolved interactively (overwrite/skip/all), and an **existing destination database, secret
or token store is preserved, never overwritten** — a merge does not corrupt the
destination's index or invalidate its tokens.

`storage backup <location>` copies the whole storage tree to a fresh (empty) location as a
complete snapshot (packages, private database, token store and `.stage`), refusing to write
into a non-empty directory.

Destructive operations warn to run with the server stopped, and `doctor` ignores temp files
younger than an hour so it does not delete an in-flight write.

`storage stats` prints a table with the item counts (private, cached and staged — the
hidden `.stage` namespace is scanned separately), the tarball count and the disk usage
(total and per category).
