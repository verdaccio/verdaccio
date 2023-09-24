# E2E CLI Testing

## What is included on these test?

- Default configuration only
- Test with all popular package managers

### Commands Tested

| cmd       | npm6 | npm7 | npm8 | npm9 | npm10 | pnpm6 | pnpm7 | yarn1 | yarn2 | yarn3 | yarn4 |
| --------- | ---- | ---- | ---- | ---- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| publish   | ✅   | ✅   | ✅   | ✅   | ✅    | ✅    | ✅    | ✅    | ✅    | ✅    | ✅    |
| info      | ✅   | ✅   | ✅   | ✅   | ✅    | ✅    | ✅    | ✅    | ✅    | ✅    | ✅    |
| audit     | ✅   | ✅   | ✅   | ✅   | ✅    | ✅    | ✅    | ✅    | ✅    | ✅    | ❌    |
| install   | ✅   | ✅   | ✅   | ✅   | ✅    | ✅    | ✅    | ✅    | ✅    | ✅    | ✅    |
| deprecate | ✅   | ✅   | ✅   | ✅   | ✅    | ✅    | ✅    | ⛔    | ⛔    | ⛔    | ⛔    |
| ping      | ✅   | ✅   | ✅   | ✅   | ✅    | ✅    | ✅    | ⛔    | ⛔    | ⛔    | ⛔    |
| search    | ✅   | ✅   | ✅   | ✅   | ✅    | ✅    | ✅    | ⛔    | ⛔    | ⛔    | ⛔    |
| star      | ✅   | ✅   | ✅   | ✅   | ✅    | ✅    | ✅    | ⛔    | ⛔    | ⛔    | ⛔    |
| stars     | ✅   | ✅   | ✅   | ✅   | ✅    | ✅    | ✅    | ⛔    | ⛔    | ⛔    | ⛔    |
| dist-tag  | ✅   | ✅   | ✅   | ✅   | ✅    | ✅    | ✅    | ✅    | ❌    | ❌    | ❌    |

> notes:
>
> - yarn search cmd exist in _modern_ but, it do not uses the search registry endpoint.
> - yarn _modern_ has two info commands, the one used here is `yarn npm info`

❌ = no tested
✅ = tested
⛔ = no supported

## How it works?

Every package manager + version is a package in the monorepo.

The package `@verdaccio/test-cli-commons` contains helpers used for each package manager.

```ts
import { addRegistry, initialSetup, prepareGenericEmptyProject } from '@verdaccio/test-cli-commons';
```

The registry can be executed with the following commands, the port is automatically assigned.

```ts
// setup
const setup = await initialSetup();
registry = setup.registry;
await registry.init();
// teardown
registry.stop();
```

The full url can be get from `registry.getRegistryUrl()`. The yarn modern does not allows the `--registry` so need a more complex step, while others is just enough adding the following to every command.

```ts
await yarn({ cwd: tempFolder }, 'install', ...addRegistry(registry.getRegistryUrl()));
```

The most of the command allow return output in JSON format which helps with the expects.

```ts
const resp = await yarn(
  { cwd: tempFolder },
  'audit',
  '--json',
  ...addRegistry(registry.getRegistryUrl())
);
const parsedBody = JSON.parse(resp.stdout as string);
expect(parsedBody.type).toEqual('auditSummary');
```

Every command should test either console output or in special cases look up the storage manually.

### What should not included on these tests?

- Anything is unrelated with client commands usage, eg: (auth permissions, third party integrations,
  hooks, plugins)
