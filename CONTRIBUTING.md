# Contributing to Verdaccio

Full text for contributing can be read [here](https://verdaccio.org/community/contributing).

## Especifics for the branch 5.x

The 5.x uses `yarn berry` with Plug and Play enabled, thus some advices are required for helping contributing:

### Debugging Jest

```bash
yarn node --inspect-brk --expose-gc $(yarn bin jest) test --runInBand --silent --logHeapUsage test/unit/modules/api/publish.spec.ts
```
