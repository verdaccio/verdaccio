---
id: unit-testing
title: "Tests Unitarios"
---
Todos los tests están divididos entre tres carpetas:

- `test/unit` - Tests que cubren funciones que transforman datos de forma no-trivial. Estos tests simplemente `require()` (requieren de) algunos archivos y código de ejecución, por lo que son muy rápidos.
- `test/functional` - Tests que ejecutan una instancia de verdaccio y realizan una serie de peticiones a esta sobre http. Son de mayor lentitud en comparación a los tests unitarios.
- `test/integration` - Tests que ejecutan una instancia de verdaccio y realizan peticiones a esta usando npm. Son considerablemente lentas y pueden incidir sobre un registro real de npm. **test sin mantenimiento**

Los tests de tipo unit y functional son ejecutados automáticamente al correr `npm test` desde el directorio raiz del proyecto. Los tests de tipo integration se suponen deben ser ejecutados de forma manual ocasionalmente.

Utilizamos `jest` para todos los tests.

## El Script npm

Para ejecutar el script de test puedes utilizar tanto `npm` como `yarn`.

    yarn run test
    

Esto accionará solo los primeros dos grupos de tests, unit y funtional.

### Usando test/unit

El siguiente es simplemente un ejemplo de cómo se debe ver un test unitario. Básicamente, sigue el estandar `jest`.

Intenta describir exactamente qué hace el test unitario en una sola frase en el encabezado de la sección `test`.

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

### Usando test/functional

Los tests functionales en verdaccio acarrean un mayor nivel de complejidad que amerita una explicación profunda para asegurar el éxito de tu experiencia.

Todo inicia en el archivo `index.js`. Adentrémosnos en este.

```javascript
// creamos tres instancias de servidores
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