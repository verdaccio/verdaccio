# Suggest to have all hooks at top-level before tests (prefer-hooks-on-top)

All hooks should be defined before the start of the tests

## Rule Details

Examples of **incorrect** code for this rule

```js
/* eslint jest/prefer-hooks-on-top: "error" */

describe("foo" () => {
  beforeEach(() => {
    //some hook code
  });
  test("bar" () => {
    some_fn();
  });
  beforeAll(() => {
    //some hook code
  });
  test("bar" () => {
    some_fn();
  });
});

// Nested describe scenario
describe("foo" () => {
  beforeAll(() => {
    //some hook code
  });
  test("bar" () => {
    some_fn();
  });
  describe("inner_foo" () => {
    beforeEach(() => {
      //some hook code
    });
    test("inner bar" () => {
      some_fn();
    });
    test("inner bar" () => {
      some_fn();
    });
    beforeAll(() => {
      //some hook code
    });
    afterAll(() => {
      //some hook code
    });
    test("inner bar" () => {
      some_fn();
    });
  });
});
```

Examples of **correct** code for this rule

```js
/* eslint jest/prefer-hooks-on-top: "error" */

describe("foo" () => {
  beforeEach(() => {
    //some hook code
  });

  // Not affected by rule
  someSetup();

  afterEach(() => {
    //some hook code
  });
  test("bar" () => {
    some_fn();
  });
});

// Nested describe scenario
describe("foo" () => {
  beforeEach(() => {
    //some hook code
  });
  test("bar" () => {
    some_fn();
  });
  describe("inner_foo" () => {
    beforeEach(() => {
      //some hook code
    });
    test("inner bar" () => {
      some_fn();
    });
  });
});
```
