---
id: unit-testing
title: Unit Testing
---
All tests are split in three folders:

- `test/unit` - Tests that cover functions that transform data in an non-trivial way. These tests simply `require()` a few files and run code in there, so they are very fast.
- `test/functional` - Tests that launch a verdaccio instance and perform a series of requests to it over http. They are slower than unit tests.
- `test/integration` - Tests that launch a verdaccio instance and do requests to it using npm. They are really slow and can hit a real npm registry. **This actually has not been tested or

Unit and functional tests are executed automatically by running `npm test` from the project's root directory. Integration tests are supposed to be executed manually from time to time.

We use `jest` for all test.

## The npm Script

To run the test script you can use either `npm` or `yarn`.

    yarn run test
    

That will trigger only two first groups of test, unit and functional.

### Using test/unit

The following is just an example how a unit test should looks like. Basically follow the `mocha` standard. Try to describe what exactly does the unit test in a single sentence in the header of the `it` section.

```javacript
'use strict';

let assert = require('assert');
let parseInterval = require('../../src/lib/utils').parseInterval;

describe('Parse interval', function() {
 before(function(done) {
    ..... some magic stuff before the show
 });

  it('server should respond on /', function(done) {
    ... this is an async test
  });});
```

### Using test/functional

Funtional testing in verdaccio has a bit more of complextity that needs a deep explanation in order to success in your experience.

All starts in the `index.js` file. Let's dive in into it.

```javascript
// create 3 server instances
require('./lib/startup');
...

describe('functional test verdaccio', function() {
  // recover the server instances
  const server = process.server;
  const server2 = process.server2;
  const server3 = process.server3;

  // On start initialise 3 verdaccio servers
  before(function(done) {
    Promise.all([
      require('./lib/startup').start('./store/test-storage', '/store/config-1.yaml'),
      require('./lib/startup').start('./store/test-storage2', '/store/config-2.yaml'),
      require('./lib/startup').start('./store/test-storage3', '/store/config-3.yaml'),
    ]).then(() => {
      done();
    }).catch(function(error) {
        console.error("error on start servers", error);
    });

  });

   before(function() {
    return Promise.all([server, server2, server3].map(function(server) {
      // save a lsof -p output in order to compare on finish on finish all test
    }));
  });

  ..........
  // here is the unique line you should add, the new functional test.
  require('./my-functional-test.js')();

  // On finish kill all server
  after(function(done) {
    Promise.all([check(server), check(server2), check(server3)]).then(function() {
      done();
    }, (reason) => {
      assert.equal(reason, null);
      done();
    });

  });
});
```

Perhaps this is not he best approach, but, it's how works right now. So, you just learnt how the bootstrap works and how to add a new group of functional tests.

#### The lib/server.js

The server class is just a wrapper that simulates a `npm` client and provides a simple API for the funtional test.

As we mention in the previous section, we are creating 3 process servers that are accessible in each process as `process.server;`, `process.server2;` and ``process.server3;`.

Using such reference you will be able to send request to any of the 3 instance running.

#### The lib/startup.js

The startup file is the responsable to create the 3 verdaccio instances and inject them to the `process.x` global variable.

#### The lib/request.js

This module holds a `PromiseAssert` which extends from `Promise` adding methods to handle all request from `lib/server.js`.

### Usage

Here we are gonna describe how it looks like an usual functional test, check inline for more detail information.

```javascript
'use strict';

module.exports = function() {
  // you can access the 3 instance through process global variables
  const server = process.server;
  const server2 = process.server2;

  describe('my-functional-group-test', function() {
    before(function() {
      // create a raw emtpy package
      const pkg = require('./fixtures/package')('new-package');
      return server.putPackage('new-package', pkg)
                  // check whether was uploaded correctly
               .status(201)
               // check whether body response is ok
               .body_ok(/created new package/);
    });

     // since before are not registred, we use emtpy it to display before putPackage was success
    it('creating new package / srv1', function() {});

    it('should do something else here ..... ', function() {
      // this should fails since fakeVersion does not exist
      // note we use server2 because is an uplink of server 1
      return server2.getTarball('new-package', 'fakeVersion')
               .status(404)
               .body_error(/no such file/);
    });
  });
};
```

### Test/integration

These section never has been used, but we are looking for help to make it run properly. All new ideas are very welcome.