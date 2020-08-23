# verdaccio-memory

[![CircleCI](https://circleci.com/gh/verdaccio/verdaccio-memory.svg?style=svg)](https://circleci.com/gh/ayusharma/verdaccio-memory)
[![codecov](https://codecov.io/gh/verdaccio/verdaccio-memory/branch/master/graph/badge.svg)](https://codecov.io/gh/verdaccio/verdaccio-memory)
[![verdaccio (latest)](https://img.shields.io/npm/v/verdaccio-memory/latest.svg)](https://www.npmjs.com/package/verdaccio-memory)
[![Known Vulnerabilities](https://snyk.io/test/github/verdaccio/verdaccio-memory/badge.svg?targetFile=package.json)](https://snyk.io/test/github/verdaccio/verdaccio-memory?targetFile=package.json)
[![backers](https://opencollective.com/verdaccio/tiers/backer/badge.svg?label=Backer&color=brightgreen)](https://opencollective.com/verdaccio)
[![discord](https://img.shields.io/discord/388674437219745793.svg)](http://chat.verdaccio.org/)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
[![node](https://img.shields.io/node/v/verdaccio-memory/latest.svg)](https://www.npmjs.com/package/verdaccio-memory)


A memory based **storage plugin**.

```
 npm install --global verdaccio-memory
```

### Requirements

>`verdaccio@3.0.0` or `verdaccio@4.x`

```
npm install -g verdaccio
```

Complete configuration example:

```yaml
store:
  memory:
    limit: 1000
```

in `config.yaml`

If `store:` is present `storage:` fallback is being ignored.

```yaml
storage: /Users/user/.local/share/verdaccio/storage
auth:
  htpasswd:
    file: ./htpasswd
store:
  memory:
    limit: 1000
```

## Disclaimer

This plugin should not be use for production environments. It might be useful for testing or such places as CI where data does not need to be persisted.

## License

[MIT](http://www.opensource.org/licenses/mit-license.php)
