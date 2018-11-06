---
id: unit-testing
title: "Test unitaire"
---
Tous les tests sont divisés en trois dossiers:

- `test/unit` - Tests couvrant les fonctions transformant les données de manière non triviale. Ces tests `demandent()` simplement peu de fichiers et exécutent le code qu'ils contiennent, ils sont donc très rapides.
- `test/fonctionnel` - Tests qui lancent une instance verdaccio et effectuent une série de requêtes via http. Ils sont plus lents que les tests unitaires.
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

La classe de serveur est uniquement un wrapper qui simule un client `npm` et fournit une simple API pour les tests fonctionnels.

Comme nous l'avons mentionné dans la section précédente, nous créons 3 serveurs de processus accessibles dans chaque processus, tels que `serveur1`, `serveur2` et `` serveur3`.

En utilisant ces références, vous pourrez envoyer des requêtes à chacune des 3 instances en cours d'exécution.

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

Cette section n'a jamais été utilisée, mais nous recherchons de l'aide pour la faire fonctionner correctement. **Toute nouvelle idée est la bienvenue.**