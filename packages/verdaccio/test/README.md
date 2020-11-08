## How to test Verdaccio

Welcome to the testing folder at Verdaccio. This document aims to help you understand how Verdaccio should be tested.

First of all, we should explain the testing frameworks being used. We use `jest` and other tools such as **`supertest`** to be able to test the API, and **`puppeteer`** for End-to-End testing.

### Before getting started

We go along with the following rules in order to be consistent with all tests which will make your code review smooth and fast:

- We **type** all our tests. eg `const foo: number = 3;`
- **Each test should be as small as possible**: You should use the `test()` block to test only one thing and do not depend on other tests. If the test requires different steps, group them with a `describe()` block.
- All `test()` **headers titles** should begin with `test('should test ...')`: For consistency with reporting tools, this makes it easier to match the test with the feature needed to be tested.
- **Any mock data** should be located in the `partials` folder in each section.
- Use `yaml` for **configuration files examples** instead of JSON.
- If you use a **file based mock storage**, it should be located in the `store` folder in each section.
- All tests **MUST NOT** rely on external sources and must be able to run them **offline**.
- Tests **must run on the following Operating Systems**: Unix (Mac, Linux) and Windows (7 -> latest).
- If you are creating mock data file which use the state and need a clean state, use `rimraf` to remove folders.

## Testing sections

Verdaccio testing is split in 3 sections, each of them has different setup and scope. The most important is the **unit test**. All sections have custom **jest configuration files**.

If you are adding new tests, comply with the following:

- If you add a new API endpoint, unit and functional tests are mandatory.
- If you add a utility, unit test is mandatory.
- If you are adding a new web API endpoint, the unit test, functional test and if such endpoint has new changes in the UI, E2E test is also mandatory.
- If you add or refactor a core class, unit test is mandatory.
- If you fix a bug, you **must** add a new `test()` block to prove that the patch fixes the bug.

## Unit test

Unit tests aim to test the CLI API and the Web API. The configuration file is located at `jest.config.js`.

> Unit testing does not need require pre-compile code, jest will catch any change done to the `{root}/src` files.

#### Testing an endpoint

We have prepared a template at `test/unit/api/api.__test.template.spec.ts` that you can follow to create your own unit test. Only the tests are appended with `.spec.ts` which will be found and used by `jest`.

> Feel free to suggest improvements to the template, there is still a lot of room for improvement.

We recommend the following approach when you create a unit test:

- For new utilities, we recommend creating a new spec.
- For existing utilities, if the method is already being tested, just add a new `test()` block.
- Notice that all API spec files are appended with `api.[feature].spec.js`, we recommend to follow the same approach. eg: `api.[deprecate].spec.js`.
- Don't mix utilities with API tests.

### How the mockServer works?

Each `[xxx].spec.ts` file usually triggers a `mockServer` on in the`beforeAll` phase. This is is handy since we might need a `uplink` server to test different scenarios.

Let's analyze the following example:

```js
const configForTest = configDefault(
  {
    auth: {
      htpasswd: {
        file: './test-storage-api-spec/.htpasswd',
      },
    },
    filters: {
      '../../modules/api/partials/plugin/filter': {
        pkg: 'npm_test',
        version: '2.0.0',
      },
    },
    storage: store,
    self_path: store,
    uplinks: {
      npmjs: {
        url: `http://${DOMAIN_SERVERS}:${mockServerPort}`,
      },
    },
    logs: [{ type: 'stdout', format: 'pretty', level: 'trace' }],
  },
  'api.spec.yaml'
);

app = await endPointAPI(configForTest);
mockRegistry = await mockServer(mockServerPort).init();
```

The `configDefault({}, 'myConfig.yaml)` function is a method that returns a configuration file that will be the config used for your test.

- The _first argument_ allows you to override/extend the default configuration located `/test/unit/partials/config/yaml/default.yaml`.
- The *second argument*s is being used to override the base configuration file, you only need to set the name `api.spec.yaml` you are willing to use, the relative location will be `test/unit/partials/config/yaml/` and will be prefixed on runtime.

> **The generated object will be used for run your test, not for mock the mock server.**

The `app = await endPointAPI(configForTest);` is the server that you are about to run your test against. The `app` object is used to call the endoints, for instance:

```js
test('should fetch jquery package from remote uplink', (done) => {
  request(app)
    .get('/jquery')
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
    .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
    .expect(HTTP_STATUS.OK)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res.body).toBeDefined();
      expect(res.body.name).toMatch(/jquery/);
      done();
    });
});
```

In the previous example, we are fetching `jquery` metadata from our server, we can define custom headers, expect some specific status and validate the body outcome.

> For more information about the **supertest** API, please [read their website](https://www.npmjs.com/package/supertest).

The `mockRegistry = await mockServer(mockServerPort).init();` mock registry will be used as `uplink` for the `app` object described above, **this is optional**, but, the most of the tests are using this approach for increase the number of tested scenarios.

The _mock server_ has a static storage which is located `test/unit/partials/mock-store`, if you need add new packages, those must be commited in such folder. **Any modification in the mock server might affect other test, since is a shared context**.

> It is not possible yet to override the mocks configuration server.

> The `config_path` is a legacy prop that must to be set manually, this prop is being generated by the CLI, but running the test without the CLI force use to generate it manually. **This might change in the future**.

> The `const mockServerPort = 55549;` mock server must be added manually, be careful and try to define a port that is not being used by another test, there is not automation here yet.

> To increase debugging you might override the `logs` property using `{ type: 'stdout', format: 'pretty', level: 'trace' }` level **trace**, thus the test will display the server request in your terminal, try to keep it in **warn** by default to avoid noise on run all your test.

#### Running a single Unit Test

To run a single test, use the following command:

```bash
yarn jest test/unit/modules/api/api.spec.ts --coverage=false
```

You might use the _jest_ feature `.only` to limit the test suites you want to run, for instance.

```js
describe.only('should test package api', () => {
```

That will help to run small chunk of tests and makes more easy the development.

#### Debugging Mock Server Request

In order to inspect more information about what is being sended between your test and the mock server, you might take advance of the `debug` library used by `request`, for instance.

```
NODE_DEBUG=request yarn jest test/unit/modules/api/api.spec.ts --runInBand=true --coverage=false
```

The outcome you will see in your terminal looks like:

```
Ran all test suites matching /test\/unit\/modules\/api\/api.spec.ts/i.
  console.error node_modules/request/request.js:136
    REQUEST onRequestResponse http://0.0.0.0:55549/jquery 200 { 'x-powered-by': 'verdaccio/4.1.0',
      'access-control-allow-origin': '*',
      'content-type': 'application/json; charset=utf-8',
      etag: '"xxxxx"',
      vary: 'Accept-Encoding',
      'content-encoding': 'gzip',
      date: 'Sat, 27 Jul 2019 06:44:13 GMT',
      connection: 'close',
      'transfer-encoding': 'chunked' }

 http --> 200, req: 'GET http://0.0.0.0:55549/jquery' (streaming)
  console.error node_modules/request/request.js:136
    REQUEST reading response's body

  console.error node_modules/request/request.js:136
    REQUEST finish init function http://0.0.0.0:55549/jquery

  console.error node_modules/request/request.js:136
    REQUEST response end http://0.0.0.0:55549/jquery 200 { 'x-powered-by': 'verdaccio/4.1.0',
      'access-control-allow-origin': '*',
      'content-type': 'application/json; charset=utf-8',
      etag: '"xxxxx"',
      vary: 'Accept-Encoding',
      'content-encoding': 'gzip',
      date: 'Sat, 27 Jul 2019 06:44:13 GMT',
      connection: 'close',
      'transfer-encoding': 'chunked' }

  console.error node_modules/request/request.js:136
    REQUEST end event http://0.0.0.0:55549/jquery

  console.error node_modules/request/request.js:136
    REQUEST has body http://0.0.0.0:55549/jquery 133608

  console.error node_modules/request/request.js:136
    REQUEST emitting complete http://0.0.0.0:55549/jquery

 http --> 200, req: 'GET http://0.0.0.0:55549/jquery', bytes: 0/133608
 debug-=- updating package jquery info
 http <-- 200, user: null(::ffff:127.0.0.1), req: 'GET /jquery', bytes: 0/10300
```

The debug display request headers and other handy information about what is happening between your test and the mock server.

## Functional tests

The functional tests aim to run only **cli endpoint** and **web point** using real request to an existing and compiled running Verdaccio server.

> Be aware if you change something in the `{root}/src` source code, you must run `yarn code:build` before to be able to see your changes because functional tests use the transpiled code.

All tests must be included in the `test/functional/index.spec.ts` file, which bootstraps the whole process. There is only one spec file and **must be only one**.

The jest configuration file is defined in `test/jest.config.functional.js`. The configuration will create a custom environment launching 3 Verdaccio servers with different configurations.

The servers are linked as follows:

- Server 1
  - -> Server 2
  - -> Server 3
- Server 2
  - -> Server 1
- Server 3
  - -> Server 2
  - -> Server 1
- Express app: (if you need to emulate any external endpoint, use the express app)

Server 1 runs on port `55551`, Server 2 on port `55552` and Server 3 on port `55553`.

> If you have the need to increase the number of servers running, it is possible, but please discuss with the team before you go in that path.

#### Adding a new block

To add a new feature you need to export the feature as a function that take as an argument any of the servers you want to interact.

```js
// newFeature.ts

export default function (server) {
  describe('package access control', () => {
    test('should ...', (done) => {
      done();
    });
  });
}
```

Then import the feature and run the function within the main `describe` block.

```js
// index.spec.ts

import newFeature from './newFeature';

describe('functional test verdaccio', function () {
  // test are fast, but do not change this time out, 10 seconds should be more than enough
  jest.setTimeout(10000);
  // servers are accessed via a global jest state.
  const server1: IServerBridge = global.__SERVERS__[0];
  const server2: IServerBridge = global.__SERVERS__[1];
  const server3: IServerBridge = global.__SERVERS__[2];
  const app = global.__WEB_SERVER__.app;

  // include as much servers you need
  newFeature(server1, server2, server3);
});
```

Functional tests run over one single file, thus, it is not possible at this stage to run tests individually.

## E2E Test

Verdaccio includes a Web User Interface that must be tested. We use End-to-End testing to run some mock tests against the web API using the UI Theme
include by default.

```bash
    yarn lint && yarn test:all
```

The test does not have aim to test the integrity of the page, mostly, ensure the basic functionality still works. If you add or modify
a UI feature, the tests must be updated.

> The tests rely on CSS classes naming convention, so, it is required some sort of coordination with the **verdaccio/ui** project.

We uses `puppeteer`, you can find more information about how to use it in their website.

## Before commit

We recommend run your tests and linters before commit.

```bash
   yarn lint && yarn test:all
```

You can find more in our [guide about run and debugging test](https://github.com/verdaccio/verdaccio/wiki/Running-and-Debugging-tests#running-the-test).

## Continuous Integration

Verdaccio uses [CircleCI](https://circleci.com/gh/verdaccio) as its primary Continuous Integration tool. We run the tests against the most common Node.js versions available. Among them is LTS and the latest release. Before the PR is being merged, all checks must be green.
Node.js versions available, LTS and the latest release. Before the PR is being merged, all check must be green.

> You need a CircleCI account to be able see the test running
