# Debuging Documentation

## Debugging tests

### Running a single test

```bash
yarn test test/integration/package.spec.ts --runInBand
```

Using `--runInBand` allows you to see the `console.log` prints, without that `jest` hidde them.

#### Display additional information

You can take advance of `debug` module used by many dependencies, eg:

- `supertest`: `DEBUG=superagent yarn test test/integration/package.spec.ts --runInBand`
- `express`: `DEBUG=express:* yarn test test/integration/package.spec.ts --runInBand`
- `nock`: `DEBUG=nock yarn test test/integration/package.spec.ts --runInBand`
- All of if: `DEBUG=* yarn test test/integration/package.spec.ts --runInBand`
