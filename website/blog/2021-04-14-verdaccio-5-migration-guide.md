---
author: Juan Picado
authorURL: https://twitter.com/jotadeveloper
authorFBID: 1122901551
title: Verdaccio 5 migration guidelines
---

**Verdaccio 5** will introduce a few breaking changes, either way the migration should be light for the most of the users, here the big details.

# Node.js requirements

The latest Node.js v12 is required to run verdaccio. The upgrade only affects those are not using the Docker.

> Verdaccio goes hand to hand with the official Node.js releases roadmap.

![noderelease](https://raw.githubusercontent.com/nodejs/Release/master/schedule.svg?sanitize=true)

We recommend, always try to use the latest LTS version to avoid next major forces you to upgrade Node.js again.

# Pino.js is the new logger

Verdaccio replaces Bunyan by [Pino.js](https://github.com/pinojs/pino) as logger, with the objective to improve the performance and delegate some features to the external tools. The new logger configuration does not support multiple streams, thus the configuration must contain one single object.

### Pretty loggin {#pretty-loggin}

Verdaccio logging pretty print is a distinguished feature the very first time `verdaccio` commands runs.

```
 http <-- 200, user: test(127.0.0.1), req: 'GET /is-accessor-descriptor/-/is-accessor-descriptor-1.0.0.tgz', bytes: 0/3250
 http <-- 200, user: test(127.0.0.1), req: 'GET /extend-shallow/-/extend-shallow-3.0.2.tgz', bytes: 0/3210
 http <-- 200, user: test(127.0.0.1), req: 'GET /define-property/-/define-property-2.0.2.tgz', bytes: 0/4047
 http <-- 200, user: test(127.0.0.1), req: 'GET /mute-stream/-/mute-stream-0.0.8.tgz', bytes: 0/2663
 http <-- 200, user: test(127.0.0.1), req: 'GET /ms/-/ms-2.1.2.tgz', bytes: 0/3017
 http <-- 200, user: test(127.0.0.1), req: 'GET /mkdirp/-/mkdirp-0.5.1.tgz', bytes: 0/4991
```

But is expensive in and not recommended to using in production environment, thus, if the environment variable `NODE_ENV=production` is detected, it will fall back automatically to `json` format.

One tecnical reasons is that `pino.final` [does not work with prettier option](https://github.com/pinojs/pino-pretty/issues/37).

To improve the performance of your registry, always use `format: json` in production.

### Multiple streams {#multiple-streams}

Even if is [supported by Pino.js](https://getpino.io/#/docs/help?id=log-to-different-streams) is not recommended for performance reasons. The log property only recognize one single option. If you were using this feature and want it back, [feel free to open a discussion](https://github.com/verdaccio/verdaccio/discussions/new?category=ideas) or contribute as opt-in feature.

```yaml
logs: { type: stdout, format: pretty, level: http }
```

> FYI: pino v7 might bring back a good performant multi-streams support, this feature might be restored in the future.

### Rotating file is not longer supported {#rotating-file-is-not-longer-supported}

Pino.js does not support log rotation, thus if you were using this feature is recommended use an [external tool](https://getpino.io/#/docs/help?id=log-rotation).

```
 // this is not longer valid
 {type: rotating-file, format: json, path: /path/to/log.jsonl, level: http, options: {period: 1d}}
```

### Deprecation {#deprecation}

**Old configuration won't crash the application**, rather will display a deprecation warning and will use the very first option in your configuration as fallback. Consider update your configuration due in the next major will throw an error.

```bash
➜  verdaccio
 warn --- config file  - /home/xxxx/.config/verdaccio/config.yaml
(node:22047) Warning: deprecate: multiple logger configuration is deprecated, please check the migration guide.
(Use `node --trace-warnings ...` to show where the warning was created)
 warn --- Plugin successfully loaded: verdaccio-htpasswd
 warn --- Plugin successfully loaded: verdaccio-audit
 warn --- http address - http://localhost:4873/ - verdaccio/5.0.0-alpha.0
```

## `npm token` {#npm-token}

The command `npm token` has been an experiment in Verdaccio 4 and on this major release is enabled by default, but was based on _LevelDB_ which requires a C and Python compiler on install to make it work. By [request](https://github.com/verdaccio/verdaccio/issues/1925) has been removed and replaced by a pure JS solution.

The default token database now is plain json file `.token-db.json` and is located in the same directory as `.verdaccio-db.json`, with this format:

```
{
  "jpicado": [
    {
      "user": "jpicado",
      "token": "MWFlM...yZDBl",
      "key": "4201e4bc47c31b3434034e40b5c35175",
      "cidr": [],
      "readonly": false,
      "created": 1609512433710
    },
    {
      "user": "jpicado",
      "token": "ZjQwZ...wYTE1",
      "key": "cc249bc2f4d248308733d70291acdc2a",
      "cidr": [],
      "readonly": false,
      "created": 1609512441024
    }
  ],
  "test": [
    {
      "user": "test",
      "token": "M2RiM...0Mzhj",
      "key": "2ae85deba977e00fb099d323173c925a",
      "cidr": [],
      "readonly": false,
      "created": 1609533131779
    }
  ]
}

```

Tokens are not being storage, just small part of it, the `key` is just a random `uuid`.

### Breaking Changes {#breaking-changes}

If you were using `npm token` in verdaccio 4, most likely the database would need to be removed and created from scratch. Remove the old database and on restart Verdaccio will generate a new one.

## `url_prefix` improved behavior {#url_prefix-improved-behavior}

The new internal logic builds correctly the public url, validates the `host` header and and bad shaped `url_prefix`.

eg: `url_prefix: /verdaccio`, `url_prefix: verdaccio/`, `url_prefix: verdaccio` would be `/verdaccio/`

### A new public url environment variable {#a-new-public-url-environment-variable}

The new `VERDACCIO_PUBLIC_URL` is intended to be used behind proxies, this variable will be used for:

- Used as base path to serve UI resources as (js, favicon, etc)
- Used on return metadata `dist` base path
- Ignores `host` and `X-Forwarded-Proto` headers
- If `url_prefix` is defined would be appened to the env variable.

```
VERDACCIO_PUBLIC_URL='https://somedomain.org';
url_prefix: '/my_prefix'

// url -> https://somedomain.org/my_prefix/

VERDACCIO_PUBLIC_URL='https://somedomain.org';
url_prefix: '/'

// url -> https://somedomain.org/

VERDACCIO_PUBLIC_URL='https://somedomain.org/first_prefix';
url_prefix: '/second_prefix'

// url -> https://somedomain.org/second_prefix/'
```

![Screenshot from 2021-03-24 20-20-11](https://user-images.githubusercontent.com/558752/112371003-5fa1ce00-8cde-11eb-888c-70c4e9776c57.png)

## Custom favicon, the new `web.favicon` property {#custom-favicon-the-new-webfavicon-property}

The _favicon_ can be set either as url or absolute path in your system.

### Local absolute path {#local-absolute-path}

```
web:
  title: Verdaccio
  favicon: /home/user/favicon.ico
```

Ensure the same user that runs the server also has permissions to access the resource you define here.

### By URL {#by-url}

```
web:
  title: Verdaccio
  favicon: https://somedomain.org/favicon.ico
```

If the logo is not defined, will fetch (and bundled in) the custom verdaccio favicon

## UI changes to consider {#ui-changes-to-consider}

The new UI may looks the same, but under the hood has consideriable changes:

- Does not contain any CSS, SVG or Fonts anymore: The UI is JS 100% based.
- It uses emotion and `<styles>` are generated on runtime by JS.
- Fonts now depends of your system, by default define a set of the most common ones.

## Web new properties for dynamic template {#web-new-properties-for-dynamic-template}

The new set of properties are made in order allow inject _html_ and _JavaScript_ scripts within the template. This
might be useful for scenarios like Google Analytics scripts or custom html in any part of the body.

- metaScripts: html injected before close the `head` element.
- scriptsbodyBefore: html injected before close the `body` element.
- scriptsBodyAfter: html injected after _verdaccio_ JS scripts.

```yaml
web:
  scriptsBodyAfter:
    - '<script type="text/javascript" src="https://my.company.com/customJS.min.js"></script>'
  metaScripts:
    - '<script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>'
    - '<script type="text/javascript" src="https://browser.sentry-cdn.com/5.15.5/bundle.min.js"></script>'
    - '<meta name="robots" content="noindex" />'
  scriptsbodyBefore:
    - '<div id="myId">html before webpack scripts</div>'
```

### UI custom plugins themes {#ui-custom-plugins-themes}

If you have a custom UI plugin for the them you will need to adapt your build to the new requirements.

The previous version you only need to return a function with a string and the path of the directory.  

```
const path = require('path');

module.exports = () => {
  return path.join(__dirname, 'static');
};
```

Since Verdaccio 5 the module must return an object and the `index.html` is ignored since support dynamic rendering, eg:

```
  staticPath: '/somePath/node_modules/verdaccio-theme-custom/static',
  manifest: {
    'main.js': '-/static/main.c21a97b1dbe8456a9c76.js',
    'runtime.js': '-/static/runtime.c21a97b1dbe8456a9c76.js',
    'NotFound.js': '-/static/NotFound.c21a97b1dbe8456a9c76.js',
    'Provider.js': '-/static/Provider.c21a97b1dbe8456a9c76.js',
    'Version.js': '-/static/Version.c21a97b1dbe8456a9c76.js',
    'Home.js': '-/static/Home.c21a97b1dbe8456a9c76.js',
    'Versions.js': '-/static/Versions.c21a97b1dbe8456a9c76.js',
    'UpLinks.js': '-/static/UpLinks.c21a97b1dbe8456a9c76.js',
    'Dependencies.js': '-/static/Dependencies.c21a97b1dbe8456a9c76.js',
    'Engines.js': '-/static/Engines.c21a97b1dbe8456a9c76.js',
    'Dist.js': '-/static/Dist.c21a97b1dbe8456a9c76.js',
    'Install.js': '-/static/Install.c21a97b1dbe8456a9c76.js',
    'Repository.js': '-/static/Repository.c21a97b1dbe8456a9c76.js',
    'vendors.js': '-/static/vendors.c21a97b1dbe8456a9c76.js',
    '718.c21a97b1dbe8456a9c76.js': '-/static/718.c21a97b1dbe8456a9c76.js',
    '238.c21a97b1dbe8456a9c76.js': '-/static/238.c21a97b1dbe8456a9c76.js',
    '73.c21a97b1dbe8456a9c76.js': '-/static/73.c21a97b1dbe8456a9c76.js'
  },
  manifestFiles: { js: [ 'runtime.js', 'vendors.js', 'main.js' ] }
```
- `staticPath`: is the same data returned in Verdaccio 4.
- `manifest`: A webpack manifest object.
- `manifestFiles`: A object with one property `js` and the array (order matters) of the manifest id to be loaded in the template dynamically.

#### Manifest and Webpack {#manifest-and-webpack}

Verdaccio uses the webpack [manifest](https://webpack.js.org/concepts/manifest/) object to render the html dynamically, in combination with the `manifestFiles` the application understand what to render.

> Currently only support `js` but if you also need `css`, we are open to discuss it and further improvements.

```
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

  plugins: [
    ...
    new WebpackManifestPlugin({
      removeKeyHash: true,
    }),
    ...
  ],

```


# Troubleshooting

### After upgrade I don't see packages on the UI {#after-upgrade-i-dont-see-packages-on-the-ui}

This migth be the storage is not being located, if you are using this format in your `config.yaml`

```
storage: ./storage
```

Use an absolute path instead, more info [here](https://github.com/verdaccio/verdaccio/issues/2204).

