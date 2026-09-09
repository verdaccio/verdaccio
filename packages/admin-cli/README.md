# @verdaccio/admin-cli

The Verdaccio admin CLI (`verdaccio-admin`) — operator-facing maintenance
commands, kept separate from the `verdaccio` binary that runs the server.

It currently ships the experimental `storage` command group for inspecting,
cleaning, repairing, moving, snapshotting and measuring the storage:

```bash
verdaccio-admin storage cache            # list cached uplink packages
verdaccio-admin storage cache --clean    # delete them (asks for confirmation)
verdaccio-admin storage view             # interactive storage browser
verdaccio-admin storage doctor [--fix]   # find (and repair) storage problems
verdaccio-admin storage migrate --to <dir>
verdaccio-admin storage backup <location>
verdaccio-admin storage stats
```

The group is experimental and may change or be removed.

## License

Verdaccio is [MIT licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE).
