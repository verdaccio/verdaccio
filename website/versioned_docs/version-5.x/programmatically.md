---
id: verdaccio-programmatically
title: 'Node.js API'
---

Verdaccio is a binary command which is available in your enviroment when you install globally the package eg `npm i -g verdaccio`, but also can be dependency in your project and use it programmatically.

### Using `fork` from `child_process` module

Using the binary is the faster way to use verdaccio programatically, you need to add to the config file the `_debug: true` to enable the messaging system, when verdaccio is ready will send `verdaccio_started` string as message as the following example.

> If you are using ESM modules the `require` won't be available.

```typescript
export function runRegistry(args: string[] = [], childOptions: {}): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    const childFork = fork(require.resolve('verdaccio/bin/verdaccio'), args, childOptions);
    childFork.on('message', (msg: { verdaccio_started: boolean }) => {
      if (msg.verdaccio_started) {
        resolve(childFork);
      }
    });
    childFork.on('error', (err: any) => reject([err]));
    childFork.on('disconnect', (err: any) => reject([err]));
  });
}
```

You can see the full example on this repository.

[https://github.com/juanpicado/verdaccio-fork](https://github.com/juanpicado/verdaccio-fork)

### Using the module API

Feature available in `v5.11.0` and higher.

> Using const verdaccio = require('verdaccio'); as the default module is not encoraged, it's deprecated and recommend use `runServer` for future compability.

There are three ways to use it:

- No input, it will find the `config.yaml` as is you would run `verdaccio` in the console.
- With a absolute path.
- With an object (there is a catch here, see below).

```js
    const {runServer} = require('verdaccio');
    const app = await runServer(); // default configuration
    const app = await runServer('./config/config.yaml');
    const app = await runServer({ configuration });
    app.listen(4000, (event) => {
      // do something
    });
```

With an object you need to add `self_path`, manually (it's not nice but would be a breaking change changing it now) on v6 this is not longer need it.

```js
const { runServer, parseConfigFile } = require('verdaccio');
const configPath = join(__dirname, './config.yaml');
const c = parseConfigFile(configPath);
// workaround
// on v5 the `self_path` still exists and will be removed in v6
c.self_path = 'foo';
runServer(c).then(() => {});
```

Feature available minor than `v5.11.0`.

> This is a valid way but is discoragued for future releases.

```js
const fs = require('fs');
const path = require('path');
const verdaccio = require('verdaccio').default;
const YAML = require('js-yaml');

const getConfig = () => {
  return YAML.load(fs.readFileSync(path.join(__dirname, 'config.yaml'), 'utf8'));
};

const cache = path.join(__dirname, 'cache');
const config = Object.assign({}, getConfig(), {
  self_path: cache,
});

verdaccio(config, 6000, cache, '1.0.0', 'verdaccio', (webServer, addrs, pkgName, pkgVersion) => {
  try {
    webServer.unref();
    webServer.listen(addrs.port || addrs.path, addrs.host, () => {
      console.log('verdaccio running');
    });
  } catch (error) {
    console.error(error);
  }
});
```
