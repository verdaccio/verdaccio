# @verdaccio/local-storage-legacy

> Only used by 5.x versions

File system storage plugin for verdaccio

[![verdaccio (latest)](https://img.shields.io/npm/v/@verdaccio/local-storage-legacy/latest.svg)](https://www.npmjs.com/package/@verdaccio/local-storage-legacy)
[![backers](https://opencollective.com/verdaccio/tiers/backer/badge.svg?label=Backer&color=brightgreen)](https://opencollective.com/verdaccio)
[![discord](https://img.shields.io/discord/388674437219745793.svg)](http://chat.verdaccio.org/)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
[![node](https://img.shields.io/node/v/@verdaccio/local-storage-legacy/latest.svg)](https://www.npmjs.com/package/@verdaccio/local-storage-legacy)

> This package is already built-in in verdaccio

```
npm install @verdaccio/local-storage-legacy
```

### API

### LocalDatabase

The main object that handle a JSON database the private packages.

#### Constructor

```
new LocalDatabase(config, logger);
```

- **config**: A verdaccio configuration instance.
- **logger**: A logger instance

### LocalFS

A class that handle an package instance in the File System

```
new LocalFS(packageStoragePath, logger);
```

## License

Verdaccio is [MIT licensed](https://github.com/verdaccio/monorepo/blob/main/LICENSE).
