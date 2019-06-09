## How To Test Verdaccio

Welcome to the testing folder at Verdaccio. This document aims to help you to go throug how Verdaccio show be tested.

First of all we must explain the stack, we use `jest` and other tools as `supertest` to be able test the API and `puppetter` for End to End testing.

We go along with the following rules in order to be consisten with all test:

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

#### Testing an endpoint

We have prepared a template `test/unit/api/api.__test.template.spec.js` that you can follow to create your own unit test.

Feel free to suggest improvements to the template, there is still a lot of room for improvement. 

### Functional Test

### E2E Test

## Before Commit

// set of steps we recommend to before commit

## Debugging Test

// debug processes is hard, we try to help you to find answers

## Continous Integration

// we explain what we test in CI

## Run Test in Docker

// running test in docker




