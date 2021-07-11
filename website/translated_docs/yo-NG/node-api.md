---
id: api-oju ipade
title: "API Oju ipade"
---

Verdaccio can be invoked programmatically. The Node API was introduced after version `verdaccio@3.0.0`.

## Ilo

#### Pẹlu eto

```js
 import startServer from 'verdaccio';

 startServer(configJsonFormat, 6000, store, '1.0.0', 'verdaccio',
    (webServer, addrs, pkgName, pkgVersion) => {
        webServer.listen(addr.port || addr.path, addr.host, () => {
            console.log('verdaccio running');
        });
  });
```

## Awọn imuṣiṣẹ miran

* [verdaccio-server](https://github.com/boringame/verdaccio-server) olupese ikọkọ ti ibi iforukọsilẹ npm ibilẹ

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
