---
id: node-api
title: Node API
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