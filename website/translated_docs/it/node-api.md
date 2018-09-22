---
id: node-api
title: "Node API"
---
Verdaccio può essere invocato a livello di programmazione. Il nodo API è stato introdotto a partire dalla versione `verdaccio@3.0.0-alpha.10`.

## Utilizzo

#### Programmazione

```js
 import startServer from 'verdaccio';   

 startServer(configJsonFormat, 6000, store, '1.0.0', 'verdaccio',
    (webServer, addrs, pkgName, pkgVersion) => {
        webServer.listen(addr.port || addr.path, addr.host, () => {
            console.log('verdaccio running');
        });
  });
```

## Altre implementazioni

* [verdaccio-server](https://github.com/boringame/verdaccio-server) registro proxy di npm locale

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