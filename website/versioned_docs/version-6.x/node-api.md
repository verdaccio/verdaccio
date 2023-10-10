---
id: node-api
title: 'Node API'
---

Verdaccio can be invoked programmatically. The Node API was introduced after version `verdaccio@3.0.0`.

## Usage {#usage}

#### Programmatically {#programmatically}

```js
const startServer = require("verdaccio").default;

let config = {
    storage: "./storage",
    auth: {
        htpasswd: {
            file: "./htpasswd"
        }
    },
    uplinks: {
        npmjs: {
            url: "https://registry.npmjs.org/",
        }
    },
    self_path: "./",
    packages: {
        "@*/*": {
            access: "$all",
            publish: "$authenticated",
            proxy: "npmjs",
        },
        "**": {
            proxy: "npmjs"
        }
    },
    log: {
            type: "stdout",
            format: "pretty",
            level: "http",
        };
};

startServer(
    config,
    6000,
    undefined,
    "1.0.0",
    "verdaccio",
    (webServer, addrs) => {
        webServer.listen(
            addrs.port || addrs.path,
            addrs.host,
            () => {
                console.log(`verdaccio running on : ${addrs.host}:${addrs.port}`);
            }
        );
    }
);
```

## Other implementations {#other-implementations}

- [verdaccio-server](https://github.com/boringame/verdaccio-server) local npm registry proxy server

```js
// js
import * as verdaccioServer from 'verdaccio-server';

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
