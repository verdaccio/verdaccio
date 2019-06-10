## How to test Verdaccio

Welcome to the testing folder at Verdaccio. This document aims to help you to go through how Verdaccio can be tested.

First of all we must explain the stack, we use `jest` and other tools such as `supertest` to be able to test the API and `puppeteer` for End-to-End testing.

We go along with the following rules in order to be consistent with all tests which will make your code review smooth and fast:

* We **type** all our tests. eg `const foo: number = 3;`
* **Each test should be as small as possible**: You should try the `test()` block to test only one thing and do not depend on other tests. If the test requires different steps, group them with a `describe()` block.
* All `test()` **headers titles** should begin with `test('should test ...)`: For consistency with reporting tools, this makes it easier to match the test with the feature needed to be tested.
* **Any mock data** should be located in the `partials` folder in each section.
* Use `yaml` for **configuration files examples** instead of JSON.
* If you use a **file based mock storage**, it should be located in the `store` folder in each section.
* All tests **MUST NOT** rely on external sources and must be able to run them **offline**.
* Tests **must run on the following Operating Systems**: Unix (Mac, Linux) and Windows (7 -> latest).
* If you are creating mock data file which use the state and need a clean state, use `rimraf` to remove folders.

## Testing sections

Verdaccio testing is being separated in 3 sections, each of them has different setup and scope, the most important is the **unit test**. All sections have custom **jest configuration files**.

If you are adding new tests, comply with the following:

* If you add a new API endpoint, the  unit test and functional test are mandatory.
* If you add a utility, unit test is mandatory.
* If you are adding a new web API endpint, the unit test, functional test and if such endpoint has new changes in the UI, E2E test is also mandatory.
* If you add or refactor a core class, unit test is mandatory.
* If you fix a bug, you **must** add a new `test()` block to prove that the patch fixes te bug.

### Unit test

Unit test aims to test the CLI API and the Web API. The configuration file is located at `jest.config.js`.

> Unit testing does not need require pre-compile code, jest will catch any change done to the `{root}/src` files.

#### Testing an endpoint

We have prepared a template at `test/unit/api/api.__test.template.spec.js` that you can follow to create your own unit test. Only the tests are appended with `.spec.js` which will be found and used by `jest`.

> Feel free to suggest improvements to the template, there is still a lot of room for improvement. 

We recommend the following approach when you create a unit test:

* For new utilities, we recommend creating a new spec.
* For existing utilities, if the method is already being tested, just add a new `test()` block.
* Notice that all API spec files are appended with `api.[feature].spec.js`, we recommend to follow the same approach. eg: `api.[deprecate].spec.js`.
* Don't mix utilities with API tests.

### Functional tests

The functional tests aim to run only **cli endpoint** and **web point** using real request to an existing and compiled running Verdaccio server.

> Be aware if you change something in the `{root}/src` source code, you must run `yarn code:build` before to be able to see your changes because functional tests use the transpiled code. 

All tests must be included in the `test/functional/index.spec.js` file, which bootstraps the whole process. There is only one spec file and **must be only one**.

The jest configuration file is defined in `test/jest.config.functional.js`. The configuration will create a custom environment launching 3 Verdaccio servers with different configurations.

The servers are linked as follows: 

* Server 1 
 * -> Server 2  
 * -> Server 3
* Server 2 
 * -> Server 1
* Server 3 
  * -> Server 2
  * -> Server 1
* Express app:  

Server 1 runs on port `55551`, Server 2 on port `55552` and Server 3 on port `55553`.

> If you have the need to increase the number of servers running, it is possible, but please discuss with the team before you go in that path.


#### Adding a new block

```
import newFeature from './newFeature';

describe('functional test verdaccio', function() {
  // test are fast, but do not change this time out, 10 seconds should be more than enough
  jest.setTimeout(10000);
  // servers are accessed vi a global jest state.
  const server1: IServerBridge = global.__SERVERS__[0];
  const server2: IServerBridge = global.__SERVERS__[1];
  const server3: IServerBridge = global.__SERVERS__[2];
  const app = global.__WEB_SERVER__.app;

  // include as much servers you need
  newFeature(server1, server2, server3);
});
```

### E2E Test

## Before commit

// set of steps we recommend to do before a commit

## Debug Test

// debugging processes is hard, we try to help you to find answers

## Continuous Integration

// we explain what we test in CI

## Run test in Docker

// running test in docker




