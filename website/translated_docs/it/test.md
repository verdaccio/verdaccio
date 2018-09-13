---
id: unit-testing
title: "Test Unità"
---
Tutti i test sono divisi in tre cartelle:

- `test/unit` - Test che coprono le funzioni che trasformano i dati in modo non banale. Questi test `require()` (necessitano) semplicemente alcuni file ed eseguono il codice in essi, quindi sono molto rapidi.
- `test/functional` - Test che lanciano un'istanza di verdaccio e realizzano una serie di richieste a essa su http. Sono più lenti dei test unità.
- `test/integration` - Test che lanciano un'istanza di verdaccio e fanno richieste a essa usando npm. Sono considerevolmente lenti e possono raggiungere un registro npm reale. **test non mantenuto**

I test unità e funzionali vengono eseguiti automaticamente all'avvio di `npm test` dalla cartella principale del progetto. I test di integrazione vanno eseguiti manualmente di volta in volta.

Usiamo `jest` per tutti i test.

## Lo Script npm

Per eseguire lo script del test si può utilizzare sia `npm` che `yarn`.

    yarn run test
    

Questo azionerà solo i primi due gruppi di test, unità e funzionale.

### Utilizzo di test/unit

Il seguente è solo un esempio di come dovrebbe vedersi un test unità. Fondamentalmente seguire il `jest` standard.

Provare a descrivere cosa fa esattamente il test unità in una sola frase nell'intestazione della sezione `test`.

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

### Utilizzo di test/functional

Il test funzionale in verdaccio presenta un maggior livello di complessità che necessita di una spiegazione esaustiva per assicurarti un'esperienza positiva.

Tutto inizia nel file `index.js`. Andiamo ad analizzarlo da vicino.

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

### Utilizzo

Qui andremo a descrivere come dovrebbe apparire un test funzionale tipico.

#### Il lib/server.js

La classe server è solamente un wrapper che simula un `npm` client e fornisce un API semplice per il test funzionale.

Come abbiamo menzionato nella sezione precedente, stiamo creando 3 server di processo che siano accessibili in ogni processo come `server1`, `server2` e ``server3`.

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