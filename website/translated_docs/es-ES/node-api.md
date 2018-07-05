---
id: node-api
title: "Nodo API"
---
Verdaccio puede ser invocado programáticamente. El API de node ha sido introducido despues de la versión `verdaccio@3.0.0-alpha.10`.

## Uso

#### Programáticamente

```js
 import startServer from 'verdaccio';   

 startServer(configJsonFormat, 6000, store, '1.0.0', 'verdaccio',
    (webServer, addrs, pkgName, pkgVersion) => {
        webServer.listen(addr.port || addr.path, addr.host, () => {
            console.log('verdaccio running');
        });
  });
```

## Otras implementaciones

* [verdaccio-server](https://github.com/boringame/verdaccio-server) servidor proxy de registro de npm local

```js
// js
import * as verdaccioServer from "verdaccio-server";
verdaccioServer.start();
verdaccioServer.stop();
verdaccioServer.list();
verdaccioServer.stopAll();
verdaccioServer.show();
verdaccioServer.cli();
// windows .net2
verdaccioServer.serviceInstall();
verdaccioServer.serviceUninstall();
verdaccioServer.serviceStart();
verdaccioServer.serviceStop();
verdaccioServer.serviceRestart();
```