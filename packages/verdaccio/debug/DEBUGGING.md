# Debugging Documentation

This section intend to provide additional information in order to debug the application.

## Debugging tests

Verdaccio uses [**jest**](https://jestjs.io/en/), the following guidelines might be useful for you: 

- https://jestjs.io/docs/en/troubleshooting#debugging-in-webstorm
- https://jestjs.io/docs/en/troubleshooting#debugging-in-vs-code
- https://jestjs.io/docs/en/cli#--debug

### Running a single test

```bash
pnpm test test/integration/package.spec.ts -- --runInBand
```

Using `--runInBand` allows you to see the `console.log` prints, without that `jest` hide them.

Display `debug` output provided for each module:

```
DEBUG=verdaccio* pnpm test -- --debug --runInBand
```

> If you don't use `--runInBand` the `debug` code won't have color.

### Running the app in debug mode

```
➜ pnpm run debug
Scope: current workspace package

> @ debug /Users/jpicado/projects/verdaccio.master.git
> node  --inspect packages/verdaccio/debug/bootstrap.js

Debugger listening on ws://127.0.0.1:9229/a31eaf3f-4d4f-4302-a677-a510f14f1ae9
For help, see: https://nodejs.org/en/docs/inspector
 warn --- http address - http://localhost:4873/ - verdaccio/5.0.0
```

The next step would be hook an inspector:

- https://nodejs.org/en/docs/guides/debugging-getting-started/
- Using the included *task* with Visual Code `.vscode/launch.json` named *Verdaccio Debug*.

#### Display additional information

You can take advance of `debug` module used by many dependencies, including Verdaccio, eg:

- `babel:*`: `DEBUG=superagent yarn test test/integration/package.spec.ts --runInBand`
- `supertest`: `DEBUG=superagent yarn test test/integration/package.spec.ts --runInBand`
- `express`: `DEBUG=express:* yarn test test/integration/package.spec.ts --runInBand`
- `nock`: `DEBUG=nock yarn test test/integration/package.spec.ts --runInBand`
- All of if: `DEBUG=* yarn test test/integration/package.spec.ts --runInBand` (*this can be really vebose*)
