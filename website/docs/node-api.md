---
id: node-api
title: "Node API"
---

Verdaccio can be invoked programmatically. The Node API was introduced after version `verdaccio@3.0.0`.

## Usage {#usage}

#### Programmatically {#programmatically}

```js
 import startServer from 'verdaccio';

 startServer(configJsonFormat, 6000, store, '1.0.0', 'verdaccio',
    (webServer, addrs, pkgName, pkgVersion) => {
		webServer.listen(addr.port || addr.path, addr.host, () => {
			console.log('verdaccio running');
		});
  });
```

## Other implementations {#other-implementations}

* [verdaccio-server](https://github.com/boringame/verdaccio-server) local npm registry proxy server

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
