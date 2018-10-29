---
id: unit-testing
title: "Unit Testing"
---
Svi testovi su podeljen i u tri foldera:

- `test/unit` - Testovi koji pokrivaju funkcije koje transformišu podatke na ne-trivijalni način. Da bi ste testirali, koristite `require()` na nekolliko fajlova i pokrenite kod, brzo se izvršava.
- `test/functional` - Test koji pokreće verdaccio instancu i pokreće seriju zahteva nad http. Ovaj tip testova je sporiji od unit testova.
- `test/integration` - Test koji pokreće verdaccio instancu i zahteva je koristeći npm. Ovaj tip testova je izuzetno spor i može da pogodi pravi npm registry. **unmaintained test**

Unit i functional testovi se automatski izvršavaju pokretanjem `npm test` iz root directorijuma projekta. Integration testovi bi trebalo da se pokreću ručno, s vremena na vreme.

Koristimo `jest` za sve testove.

## The npm Script

Da biste pokrenuli test skriptu, možete koristiti bilo `npm` ili `yarn`.

    yarn run test
    

To će pokrenuti samo prve dve grupe testova, unit i functional.

### Korišćenje test/unit

U navedenom primeru možete videti kako bi unit test trebalo da izgleda. Suštinski, samo pratite `jest` standard.

Pokušajte da u jednoj rečenici u zaglavlju `test` sekcije objasnite tačno šta bi unit test trebalo da radi.

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

Here we are gonna describe how it looks like an usual functional test, check inline for more detail information.

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