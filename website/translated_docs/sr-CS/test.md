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

### Korišćenje test/functional

Funkcionalno testiranje u verdaccio-u je nešto kompleksnije i zahteva detaljno objađnjenje.

Sve počinje od `index.js` fajla. Hajde da se bacimo u rešavanje problema.

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

### Korišćenje

Ovde ćemo pokazati kako izgleda funkcionalni test, proverite inline i saznajte više detalja.

#### The lib/server.js

Server class je samo wrapper koji simulira `npm` client i obezbeđuje jednostavan API za funkcionalni test.

Kao što smo već opisali u prethodnoj sekciji, kreiramo 3 proces servera koji su dostupni u svakom procesu kao `server1`, `server2` i``server3`.

Koristeći takve reference, moći ćete da šaljete zahtev do bilo koje 3 pokrenute instance.

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

Ove sekcije nikada nisu korišćene, te stoga tražimo pomoć kako bi radile na ispravan način. **Svaka ideja i svaka pomoć je dobrodošla.**