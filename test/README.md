## How To Test Verdaccio

Welcome to the testing folder at Verdaccio. This document aims to help you to go throug how Verdaccio show be tested.

First of all we must explain the stack, we use `jest` and other tools as `supertest` to be able test the API and `puppetter` for End to End testing.

We go along with the following rules in order to be consisten with all test and will make your code review smooth and fast:

* We **type** all our test. eg `const foo: number = 3;`
* **Each test should be small as possible**: You should try the `test()` block try to test only one thing and no dependencies with other test. If test requires different steps, groupd them woth `describe()` block.
* All `test()` **headers title** should init with `test('should test ...)`: For consistency with reporting tools, this makes more easy to match the test with the feature need to be tested.
* **Any mock data** should be located in the `partials` folder in each section.
* Use `yaml` for **configuration files examples** instead use JSON.
* If you use a **file based mock storage**, should be located in the `store` folder in each section.
* All test **MUST NOT** rely in external sources and must be able to run them **off line**.
* Test must run in the following Operative System: Unix (Mac, Linux) and Windows (7 -> latest).
* If you are creating mock data file based and need a clean state, use `rimraf` to remove folders.

## Testing Sections

Verdaccio testing is being separated in 3 sections, each of them have different setup and scope, the most important is **unit test**. All sections has custom **jest configuration files**.

If you are adding new test, comply with the following:

* If you add a new API endpoint, the  unit test and functional test are mandatory.
* If you add a utility, unit test is mandatory.
* If you are adding a new web API endpint, the unit test, functional test and if such endpoint has new changes in the UI, e2 is also mandatory.
* If you add or refactor a core class, unit test is mandatory.
* If you fix a bug, you **must** add a new `test()` block proving that the patch fix te bug.

### Unit Test

Unit test aims to test the CLI API and the Web API. The configuration file is located `jest.config.js`.

> Unit testing do not need pre-compile code, jest will catch any change done to the `{root}/src` files.

#### Testing an endpoint

We have prepared a template `test/unit/api/api.__test.template.spec.js` that you can follow to create your own unit test. Only the test are prefixed with `.spec.js` will be catch by jest.

> Feel free to suggest improvements to the template, there is still a lot of room for improvement. 

We recommend the following approach when you create a unit test:

* For new utilities, we recommend create a new spec.
* For existing utitlities, if the method is already being tested, just add a new `test()` block.
* Notice that all api spec files are prefixed with `api.[feature].spec.js`, we recommend follow the same approach. eg: `api.[deprecate].spec.js`.
* Don't mix utilities with API test.

### Functional Test

The functional test aims to run only **cli endpoint** and **web point** real request to an existing and compiled verdaccio server running.

> Be aware if you change something in the `{root}/src` source code, you must run `yarn code:build` before be able see your changes, functional test uses transpiled code. 

All tests must be included in the `test/functional/index.spec.js` file, wich bootstrap the whole process.

The jest configuration file is defined in `test/jest.config.functional.js`. The configuration will create a custom environment launching 3 verdaccio servers with different configurations.

The servers are linked as follows. 

* Server 1 
 * -> Server 2  
 * -> Server 3
* Server 2 
 * -> Server 1
* Server 3 
  * -> Server 2
  * -> Server 1

Server 1 runs on port `55551`, Server 2 on port `55552` and Server 3 on port `55553`.

> If you have the need to increase the number of servers running, it is possible, but please discuss with the team before go in that path.

### E2E Test

## Before Commit

// set of steps we recommend to before commit

## Debugging Test

// debug processes is hard, we try to help you to find answers

## Continous Integration

// we explain what we test in CI

## Run Test in Docker

// running test in docker




