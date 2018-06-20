---
id: unit-testing
title: "Tests Unitarios"
---
Todos los tests están divididos entre tres carpetas:

- `test/unit` - Tests que cubren funciones que transforman datos de forma no-trivial. Estos tests simplemente `require()` (requieren de) algunos archivos y código de ejecución, por lo que son muy rápidos.
- `test/functional` - Tests que ejecutan una instancia de verdaccio y realizan una serie de peticiones a esta sobre http. Son de mayor lentitud en comparación a los tests unitarios.
- `test/integration` - Tests que ejecutan una instancia de verdaccio y realizan peticiones a esta usando npm. Son considerablemente lentas y pueden incidir sobre un registro real de npm. **test sin mantenimiento**

Los tests de tipo unit y functional son ejecutados automáticamente al correr `npm test` desde el directorio raíz del proyecto. Los tests de tipo integration se suponen deben ser ejecutados de forma manual ocasionalmente.

Utilizamos `jest` para todos los tests.

## El Script npm

Para ejecutar el script de test puedes utilizar tanto `npm` como `yarn`.

    yarn run test
    

Esto accionará solo los primeros dos grupos de tests, unit y funtional.

### Usando test/unit

El siguiente es simplemente un ejemplo de cómo se debe ver un test unitario. Básicamente, sigue el estándar `jest`.

Intenta describir exactamente qué hace el test unitario en una sola frase en el encabezado de la sección `test`.

```javacript
const verdaccio = require('../../src/api/index');
const config = require('./partials/config');

 describe('basic system test', () => {

  beforeAll(function(done) {
    // algo importante
  });

  afterAll((done) => {
    // deshacer algo importante
  });

  test('server should respond on /', done => {
    // tu test
    done();
  });
});
```

### Usando test/functional

Los tests funcionales en verdaccio acarrean un mayor nivel de complejidad que amerita una explicación profunda para asegurar el éxito de tu experiencia.

Todo inicia en el archivo `index.js`. Adentrémonos en este.

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

    // revisamos si todas las instancias han sido iniciadas, desde su ejecución en procesos independientes
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

    // al finalizarlas, nos aseguramos de que han sido detenidas
    afterAll(() => {
      _.map(processRunning, (fork) => {
        fork.stop();
      });
      express.server.close();
    });


```

### Uso

Aquí describiremos cómo se ve un test funcional típico.

#### El lib/server.js

La clase de servidor es tan solo un wrapper que simula un cliente `npm` y proporciona un API simple para el test funcional.

Como mencionamos en la sección previa, estamos creando 3 servidores de proceso que son accesibles en cada proceso como `server1`, `server2` y ``server3`.

Usando dichas referencias serás capaz de enviar peticiones a cualquiera de las 3 instancias en ejecución.

```javascript
<br />export default function(server) {
  // recibimos cualquier instancia de servidor a través de argumentos
  test('add tag - 404', () => {
    // interactuamos con la instancia de servidor.
    return server.addTag('testpkg-tag', 'tagtagtag', '0.0.1').status(404).body_error(/no such package/);
  });
});
```

### Test/integration

Esta sección no ha sido usada jamás, pero estamos buscando ayuda con la intención de poder ejecutarla apropiadamente. **Toda idea nueva es bien recibida.**