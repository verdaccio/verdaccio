# E2E Testing

## What is included on these test?

- Default configuration only
- Basic commands eg (`install / add`, `info`, `publish`).
- Test with 3 package managers (`yarn classic`, `pnpm` and `npm@7`)

## How it works?

On run test suites, there is a global setup where will install the local source code of verdaccio in a temporary folder.
Each suite will install.

1. `spawn` a registry on port `6001` using `_bootstrap_verdaccio.yaml` which block any local package being
   fetched from remote upstream.
2. Publish local project to the spawned registry (with global `pnpm`)

> The published `verdaccio` should be fetch by each suite to ensure reliability of each test.

## How to write test?

Each of the suite must use a package manager command _(eg: `npm install`)_ and validate the output according what the
user see, either verifying the outcome in JSON form, run a command _(`eg: jest ..`)_ and the expected result.

Each Test should start with the initial setup, this step does the following

- `beforeAll`: Install verdaccio to the suite context that returns a `Setup` object.
- `afterAll`: Stop the child process that runs verdaccio.

```js
beforeAll(async () => {
  setup = await initialSetup(tempRootFolder, port);
  console.log('--setup', setup.install);
});
```

stop the process is the final step that should occur in every suite.

```js
afterAll(async () => {
  setup.child.kill();
});
```

### What should not included on these tests?

- Anything is unrelated with client commands usage, eg: (auth permissions, third party integrations,
  hooks, plugins)
