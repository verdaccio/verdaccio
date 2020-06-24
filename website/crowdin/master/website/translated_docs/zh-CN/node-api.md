---
id: node-api
title: "Node API"
---

Verdaccio can be invoked programmatically. The node API was introduced after version `verdaccio@3.0.0-alpha.10`.

## 使用

#### 编程

```js
 mport startServer from 'verdaccio';   

 startServer(configJsonFormat, 6000, store, '1.0.0', 'verdaccio',
    (webServer, addrs, pkgName, pkgVersion) => {
        webServer.listen(addr.port || addr.path, addr.host, () => {
            console.log('verdaccio running');
        });
  });
```

## 其他执行

* [verdaccio-server](https://github.com/boringame/verdaccio-server) 本地 npm registry proxy server（代理服务器）

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