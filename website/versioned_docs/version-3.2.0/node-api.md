---
id: version-3.2.0-node-api
title: Node API
original_id: node-api
---

Verdaccio can be invoqued programmatically. The node API was introduced after version `verdaccio@3.0.0-alpha.10`.

## Usage

#### Programmatically

```js
 import startServer from 'verdaccio';	

 startServer(configJsonFormat, 6000, store, '1.0.0', 'verdaccio',
    (webServer, addrs, pkgName, pkgVersion) => {
		webServer.listen(addr.port || addr.path, addr.host, () => {
			console.log('verdaccio running');
		});
  });
```

## Other implementations

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
