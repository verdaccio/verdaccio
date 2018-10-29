---
id: unit-testing
title: "Unit Testing"
---
All tests are split in three folders:

- `test/unit` - Tests that cover functions that transform data in an non-trivial way. These tests simply `require()` a few files and run code in there, so they are very fast.
- `test/functional` - Tests that launch a verdaccio instance and perform a series of requests to it over http. They are slower than unit tests.
- `test/integration` - Tests that launch a verdaccio instance and do requests to it using npm. They are really slow and can hit a real npm registry. **unmaintained test**

Unit and functional tests are executed automatically by running `npm test` from the project's root directory. Integration tests are supposed to be executed manually from time to time.

We use `jest` for all test.

## The npm Script

To run the test script you can use either `npm` or `yarn`.

    yarn run test
    

That will trigger only two first groups of test, unit and functional.

### Using test/unit

The following is just an example how a unit test should looks like. Basically follow the `jest` standard.

Try to describe what exactly does the unit test in a single sentence in the header of the `test` section.

```javacript
const verdaccio = require('../../src/api/index');
const config = require('./partials/config');

describe('basic system test', () => {

  beforeAll(function(done) {
    // something important
  });

  afterAll((done) => {
    // undo something important
  });

  test('server should respond on /', done => {
    // your test
    done();
  });
});
```

### Using test/functional

Funtional testing in verdaccio has a bit more of complextity that needs a deep explanation in order to success in your experience.

All starts in the `index.js` file. Let's dive in into it.

```javascript
// we create 3 server instances
 const config1 = new VerdaccioConfig(
    './store/test-storage',
    './store/config-1.yaml',
    'http://localhost:55551/');
  const config2 = new VerdaccioConfig(
      './store/test-storage2',
      './store/config-2.yaml',
      'http://localhost:55552/');
  const config3 = new VerdaccioConfig(
        './store/test-storage3',
        './store/config-3.yaml',
        'http://localhost:55553/');
  const server1: IServerBridge = new Server(config1.domainPath);
  const server2: IServerBridge = new Server(config2.domainPath);
  const server3: IServerBridge = new Server(config3.domainPath);
  const process1: IServerProcess = new VerdaccioProcess(config1, server1, SILENCE_LOG);
  const process2: IServerProcess = new VerdaccioProcess(config2, server2, SILENCE_LOG);
  const process3: IServerProcess = new VerdaccioProcess(config3, server3, SILENCE_LOG);
  const express: any = new ExpressServer();
  ...

    // we check whether all instances has been started, since run in independent processes
    beforeAll((done) => {
      Promise.all([
        process1.init(),
        process2.init(),
        process3.init()]).then((forks) => {
          _.map(forks, (fork) => {
            processRunning.push(fork[0]);
          });
          express.start(EXPRESS_PORT).then((app) =>{
            done();
          }, (err) => {
            done(err);
          });
      }).catch((error) => {
        done(error);
      });
    });

    // after finish all, we ensure are been stoped
    afterAll(() => {
      _.map(processRunning, (fork) => {
        fork.stop();
      });
      express.server.close();
    });


```

### Usage

Ici nous allons décrire à quoi devrait ressembler un test fonctionnel typique. Vérifiez inline pour plus d'informations détaillées.

#### The lib/server.js

The server class is just a wrapper that simulates a `npm` client and provides a simple API for the funtional test.

As we mention in the previous section, we are creating 3 process servers that are accessible in each process as `server1`, `server2` and ``server3`.

Using such reference you will be able to send request to any of the 3 instance running.

```javascript
<br />export default function(server) {
  // we recieve any server instance via arguments
  test('add tag - 404', () => {
    // we interact with the server instance.
    return server.addTag('testpkg-tag', 'tagtagtag', '0.0.1').status(404).body_error(/no such package/);
  });
});
```

### Test/integration

These section never has been used, but we are looking for help to make it run properly. **All new ideas are very welcome.**