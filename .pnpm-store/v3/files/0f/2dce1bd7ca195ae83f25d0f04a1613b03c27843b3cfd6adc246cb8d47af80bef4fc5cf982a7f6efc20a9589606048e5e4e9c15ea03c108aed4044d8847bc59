<p align="center">
  <img alt="npm formidable package logo" src="https://raw.githubusercontent.com/node-formidable/formidable/master/logo.png" />
</p>

# formidable [![npm version][npmv-img]][npmv-url] [![MIT license][license-img]][license-url] [![Libera Manifesto][libera-manifesto-img]][libera-manifesto-url] [![Twitter][twitter-img]][twitter-url]

> A Node.js module for parsing form data, especially file uploads.

### Important Notes

- This README is for the upcoming (end of February) v2 release!
- Every version prior and including `v1.2.2` is deprecated, please upgrade!
- Install with `formidable@canary` until v2 land officially in `latest`
- see more about the changes in the [CHANGELOG.md](https://github.com/node-formidable/formidable/blob/master/CHANGELOG.md)

[![Code style][codestyle-img]][codestyle-url]
[![codecoverage][codecov-img]][codecov-url]
[![linux build status][linux-build-img]][build-url]
[![windows build status][windows-build-img]][build-url]
[![macos build status][macos-build-img]][build-url]

If you have any _how-to_ kind of questions, please read the [Contributing
Guide][contributing-url] and [Code of Conduct][code_of_conduct-url]
documents.<br /> For bugs reports and feature requests, [please create an
issue][open-issue-url] or ping [@tunnckoCore](https://twitter.com/tunnckoCore)
at Twitter.

[![Conventional Commits][ccommits-img]][ccommits-url]
[![Minimum Required Nodejs][nodejs-img]][npmv-url]
[![Tidelift Subcsription][tidelift-img]][tidelift-url]
[![Buy me a Kofi][kofi-img]][kofi-url]
[![Renovate App Status][renovateapp-img]][renovateapp-url]
[![Make A Pull Request][prs-welcome-img]][prs-welcome-url]

This project is [semantically versioned](https://semver.org) and available as
part of the [Tidelift Subscription][tidelift-url] for professional grade
assurances, enhanced support and security.
[Learn more.](https://tidelift.com/subscription/pkg/npm-formidable?utm_source=npm-formidable&utm_medium=referral&utm_campaign=enterprise)

_The maintainers of `formidable` and thousands of other packages are working
with Tidelift to deliver commercial support and maintenance for the Open Source
dependencies you use to build your applications. Save time, reduce risk, and
improve code health, while paying the maintainers of the exact dependencies you
use._

[![][npm-weekly-img]][npmv-url] [![][npm-monthly-img]][npmv-url]
[![][npm-yearly-img]][npmv-url] [![][npm-alltime-img]][npmv-url]

## Status: Maintained [![npm version][npmv-canary-img]][npmv-url]

This module was initially developed by
[**@felixge**](https://github.com/felixge) for
[Transloadit](http://transloadit.com/), a service focused on uploading and
encoding images and videos. It has been battle-tested against hundreds of GBs of
file uploads from a large variety of clients and is considered production-ready
and is used in production for years.

Currently, we are few maintainers trying to deal with it. :) More contributors
are always welcome! :heart: Jump on
[issue #412](https://github.com/felixge/node-formidable/issues/412) which is
closed, but if you are interested we can discuss it and add you after strict rules, like
enabling Two-Factor Auth in your npm and GitHub accounts.

_**Note:** The github `master` branch is a "canary" branch - try it with `npm i formidable@canary`.
Do not expect (for now) things from it to be inside the`latest` "dist-tag" in the
Npm. The`formidable@latest`is the`v1.2.1` version and probably it will be the
last`v1` release!_

_**Note: v2 is coming soon!**_

## Highlights

- [Fast (~900-2500 mb/sec)](#benchmarks) & streaming multipart parser
- Automatically writing file uploads to disk (soon optionally)
- [Plugins API](#useplugin-plugin) - allowing custom parsers and plugins
- Low memory footprint
- Graceful error handling
- Very high test coverage

## Install

This project requires `Node.js >= 10.13`. Install it using
[yarn](https://yarnpkg.com) or [npm](https://npmjs.com).<br /> _We highly
recommend to use Yarn when you think to contribute to this project._

```sh
npm install formidable
# or the canary version
npm install formidable@canary
```

or with Yarn v1/v2

```sh
yarn add formidable
# or the canary version
yarn add formidable@canary
```

This is a low-level package, and if you're using a high-level framework it _may_
already be included. Check the examples below and the `examples/` folder.

## Examples

For more examples look at the `examples/` directory.

### with Node.js http module

Parse an incoming file upload, with the
[Node.js's built-in `http` module](https://nodejs.org/api/http.html).

```js
const http = require('http');
const formidable = require('formidable');

const server = http.createServer((req, res) => {
  if (req.url === '/api/upload' && req.method.toLowerCase() === 'post') {
    // parse a file upload
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ fields, files }, null, 2));
    });

    return;
  }

  // show a file upload form
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(`
    <h2>With Node.js <code>"http"</code> module</h2>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>Text field title: <input type="text" name="title" /></div>
      <div>File: <input type="file" name="multipleFiles" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
  `);
});

server.listen(8080, () => {
  console.log('Server listening on http://localhost:8080/ ...');
});
```

### with Express.js

There are multiple variants to do this, but Formidable just need Node.js Request
stream, so something like the following example should work just fine, without
any third-party [Express.js](https://ghub.now.sh/express) middleware.

Or try the
[examples/with-express.js](https://github.com/node-formidable/node-formidable/blob/master/examples/with-express.js)

```js
const express = require('express');
const formidable = require('formidable');

const app = express();

app.get('/', (req, res) => {
  res.send(`
    <h2>With <code>"express"</code> npm package</h2>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>Text field title: <input type="text" name="title" /></div>
      <div>File: <input type="file" name="someExpressFiles" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
  `);
});

app.post('/api/upload', (req, res, next) => {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    res.json({ fields, files });
  });
});

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000 ...');
});
```

### with Koa and Formidable

Of course, with [Koa v1, v2 or future v3](https://ghub.now.sh/koa) the things
are very similar. You can use `formidable` manually as shown below or through
the [koa-better-body](https://ghub.now.sh/koa-better-body) package which is
using `formidable` under the hood and support more features and different
request bodies, check its documentation for more info.

_Note: this example is assuming Koa v2. Be aware that you should pass `ctx.req`
which is Node.js's Request, and **NOT** the `ctx.request` which is Koa's Request
object - there is a difference._

```js
const Koa = require('koa');
const formidable = require('formidable');

const app = new Koa();

app.on('error', (err) => {
  console.error('server error', err);
});

app.use(async (ctx, next) => {
  if (ctx.url === '/api/upload' && ctx.method.toLowerCase() === 'post') {
    const form = formidable({ multiples: true });

    // not very elegant, but that's for now if you don't want touse `koa-better-body`
    // or other middlewares.
    await new Promise((resolve, reject) => {
      form.parse(ctx.req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }

        ctx.set('Content-Type', 'application/json');
        ctx.status = 200;
        ctx.state = { fields, files };
        ctx.body = JSON.stringify(ctx.state, null, 2);
        resolve();
      });
    });
    await next();
    return;
  }

  // show a file upload form
  ctx.set('Content-Type', 'text/html');
  ctx.status = 200;
  ctx.body = `
    <h2>With <code>"koa"</code> npm package</h2>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
    <div>Text field title: <input type="text" name="title" /></div>
    <div>File: <input type="file" name="koaFiles" multiple="multiple" /></div>
    <input type="submit" value="Upload" />
    </form>
  `;
});

app.use((ctx) => {
  console.log('The next middleware is called');
  console.log('Results:', ctx.state);
});

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000 ...');
});
```

## Benchmarks (for v2)

The benchmark is quite old, from the old codebase. But maybe quite true though.
Previously the numbers was around ~500 mb/sec. Currently with moving to the new
Node.js Streams API it's faster. You can clearly see the differences between the
Node versions.

_Note: a lot better benchmarking could and should be done in future._

Benchmarked on 8GB RAM, Xeon X3440 (2.53 GHz, 4 cores, 8 threads)

```
~/github/node-formidable master
❯ nve --parallel 8 10 12 13 node benchmark/bench-multipart-parser.js

 ⬢  Node 8

1261.08 mb/sec

 ⬢  Node 10

1113.04 mb/sec

 ⬢  Node 12

2107.00 mb/sec

 ⬢  Node 13

2566.42 mb/sec
```

![benchmark January 29th, 2020](./benchmark-2020-01-29_xeon-x3440.png)

## API

### Formidable / IncomingForm

All shown are equivalent.

_Please pass [`options`](#options) to the function/constructor, not by assigning
them to the instance `form`_

```js
const formidable = require('formidable');
const form = formidable(options);

// or
const { formidable } = require('formidable');
const form = formidable(options);

// or
const { IncomingForm } = require('formidable');
const form = new IncomingForm(options);

// or
const { Formidable } = require('formidable');
const form = new Formidable(options);
```

### Options

See it's defaults in [src/Formidable.js](./src/Formidable.js#L14-L22) (the
`DEFAULT_OPTIONS` constant).

- `options.encoding` **{string}** - default `'utf-8'`; sets encoding for
  incoming form fields,
- `options.uploadDir` **{string}** - default `os.tmpdir()`; the directory for
  placing file uploads in. You can move them later by using `fs.rename()`
- `options.keepExtensions` **{boolean}** - default `false`; to include the
  extensions of the original files or not
- `options.maxFileSize` **{number}** - default `200 * 1024 * 1024` (200mb);
  limit the size of uploaded file.
- `options.maxFields` **{number}** - default `1000`; limit the number of fields
  that the Querystring parser will decode, set 0 for unlimited
- `options.maxFieldsSize` **{number}** - default `20 * 1024 * 1024` (20mb);
  limit the amount of memory all fields together (except files) can allocate in
  bytes.
- `options.hash` **{boolean}** - default `false`; include checksums calculated
  for incoming files, set this to some hash algorithm, see
  [crypto.createHash](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options)
  for available algorithms
- `options.multiples` **{boolean}** - default `false`; when you call the
  `.parse` method, the `files` argument (of the callback) will contain arrays of
  files for inputs which submit multiple files using the HTML5 `multiple`
  attribute. Also, the `fields` argument will contain arrays of values for
  fields that have names ending with '[]'.

_**Note:** If this size of combined fields, or size of some file is exceeded, an
`'error'` event is fired._

```js
// The amount of bytes received for this form so far.
form.bytesReceived;
```

```js
// The expected number of bytes in this form.
form.bytesExpected;
```

### .parse(request, callback)

Parses an incoming Node.js `request` containing form data. If `callback` is
provided, all fields and files are collected and passed to the callback.

```js
const formidable = require('formidable');

const form = formidable({ multiples: true, uploadDir: __dirname });

form.parse(req, (err, fields, files) => {
  console.log('fields:', fields);
  console.log('files:', files);
});
```

You may overwrite this method if you are interested in directly accessing the
multipart stream. Doing so will disable any `'field'` / `'file'` events
processing which would occur otherwise, making you fully responsible for
handling the processing.

In the example below, we listen on couple of events and direct them to the
`data` listener, so you can do whatever you choose there, based on whether its
before the file been emitted, the header value, the header name, on field, on
file and etc.

Or the other way could be to just override the `form.onPart` as it's shown a bit
later.

```js
form.once('error', console.error);

form.on('fileBegin', (filename, file) => {
  form.emit('data', { name: 'fileBegin', filename, value: file });
});

form.on('file', (filename, file) => {
  form.emit('data', { name: 'file', key: filename, value: file });
});

form.on('field', (fieldName, fieldValue) => {
  form.emit('data', { name: 'field', key: fieldName, value: fieldValue });
});

form.once('end', () => {
  console.log('Done!');
});

// If you want to customize whatever you want...
form.on('data', ({ name, key, value, buffer, start, end, ...more }) => {
  if (name === 'partBegin') {
  }
  if (name === 'partData') {
  }
  if (name === 'headerField') {
  }
  if (name === 'headerValue') {
  }
  if (name === 'headerEnd') {
  }
  if (name === 'headersEnd') {
  }
  if (name === 'field') {
    console.log('field name:', key);
    console.log('field value:', value);
  }
  if (name === 'file') {
    console.log('file:', key, value);
  }
  if (name === 'fileBegin') {
    console.log('fileBegin:', key, value);
  }
});
```

### .use(plugin: Plugin)

A method that allows you to extend the Formidable library. By default we include
4 plugins, which esentially are adapters to plug the different built-in parsers.

**The plugins added by this method are always enabled.**

_See [src/plugins/](./src/plugins/) for more detailed look on default plugins._

The `plugin` param has such signature:

```typescript
function(formidable: Formidable, options: Options): void;
```

The architecture is simple. The `plugin` is a function that is passed with the
Formidable instance (the `form` across the README examples) and the options.

**Note:** the plugin function's `this` context is also the same instance.

```js
const formidable = require('formidable');

const form = formidable({ keepExtensions: true });

form.use((self, options) => {
  // self === this === form
  console.log('woohoo, custom plugin');
  // do your stuff; check `src/plugins` for inspiration
});

form.parse(req, (error, fields, files) => {
  console.log('done!');
});
```

**Important to note**, is that inside plugin `this.options`, `self.options` and
`options` MAY or MAY NOT be the same. General best practice is to always use the
`this`, so you can later test your plugin independently and more easily.

If you want to disable some parsing capabilities of Formidable, you can disable
the plugin which corresponds to the parser. For example, if you want to disable
multipart parsing (so the [src/parsers/Multipart.js](./src/parsers/Multipart.js)
which is used in [src/plugins/multipart.js](./src/plugins/multipart.js)), then
you can remove it from the `options.enabledPlugins`, like so

```js
const { Formidable } = require('formidable');

const form = new Formidable({
  hash: 'sha1',
  enabledPlugins: ['octetstream', 'querystring', 'json'],
});
```

**Be aware** that the order _MAY_ be important too. The names corresponds 1:1 to
files in [src/plugins/](./src/plugins) folder.

Pull requests for new built-in plugins MAY be accepted - for example, more
advanced querystring parser. Add your plugin as a new file in `src/plugins/`
folder (lowercased) and follow how the other plugins are made.

### form.onPart

If you want to use Formidable to only handle certain parts for you, you can do
something similar. Or see
[#387](https://github.com/node-formidable/node-formidable/issues/387) for
inspiration, you can for example validate the mime-type.

```js
const form = formidable();

form.onPart = (part) => {
  part.on('data', (buffer) {
    // do whatever you want here
  });
};
```

For example, force Formidable to be used only on non-file "parts" (i.e., html
fields)

```js
const form = formidable();

form.onPart = function(part) {
  // let formidable handle only non-file parts
  if (part.filename === '' || !part.mime) {
    // used internally, please do not override!
    form.handlePart(part);
  }
};
```

### File

```ts
export interface File {
  // The size of the uploaded file in bytes.
  // If the file is still being uploaded (see `'fileBegin'` event),
  // this property says how many bytes of the file have been written to disk yet.
  file.size: number;

  // The path this file is being written to. You can modify this in the `'fileBegin'` event in
  // case you are unhappy with the way formidable generates a temporary path for your files.
  file.path: string;

  // The name this file had according to the uploading client.
  file.name: string | null;

  // The mime type of this file, according to the uploading client.
  file.type: string | null;

  // A Date object (or `null`) containing the time this file was last written to.
  // Mostly here for compatibility with the [W3C File API Draft](http://dev.w3.org/2006/webapi/FileAPI/).
  file.lastModifiedDate: Date | null;

  // If `options.hash` calculation was set, you can read the hex digest out of this var.
  file.hash: string | 'sha1' | 'md5' | 'sha256' | null;
}
```

#### file.toJSON()

This method returns a JSON-representation of the file, allowing you to
`JSON.stringify()` the file which is useful for logging and responding to
requests.

### Events

#### `'progress'`

Emitted after each incoming chunk of data that has been parsed. Can be used to
roll your own progress bar.

```js
form.on('progress', (bytesReceived, bytesExpected) => {});
```

#### `'field'`

Emitted whenever a field / value pair has been received.

```js
form.on('field', (name, value) => {});
```

#### `'fileBegin'`

Emitted whenever a new file is detected in the upload stream. Use this event if
you want to stream the file to somewhere else while buffering the upload on the
file system.

```js
form.on('fileBegin', (name, file) => {});
```

#### `'file'`

Emitted whenever a field / file pair has been received. `file` is an instance of
`File`.

```js
form.on('file', (name, file) => {});
```

#### `'error'`

Emitted when there is an error processing the incoming form. A request that
experiences an error is automatically paused, you will have to manually call
`request.resume()` if you want the request to continue firing `'data'` events.

```js
form.on('error', (err) => {});
```

#### `'aborted'`

Emitted when the request was aborted by the user. Right now this can be due to a
'timeout' or 'close' event on the socket. After this event is emitted, an
`error` event will follow. In the future there will be a separate 'timeout'
event (needs a change in the node core).

```js
form.on('aborted', () => {});
```

#### `'end'`

Emitted when the entire request has been received, and all contained files have
finished flushing to disk. This is a great place for you to send your response.

```js
form.on('end', () => {});
```

## Ports & Credits

- [multipart-parser](http://github.com/FooBarWidget/multipart-parser): a C++
  parser based on formidable
- [Ryan Dahl](http://twitter.com/ryah) for his work on
  [http-parser](http://github.com/ry/http-parser) which heavily inspired the
  initial `multipart_parser.js`.

## Contributing

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction. If you would like to help us fix
a bug or add a new feature, please check our
[Contributing Guide](./CONTRIBUTING.md). Pull requests are welcome!

Thanks goes to these wonderful people
([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://twitter.com/felixge"><img src="https://avatars3.githubusercontent.com/u/15000?s=460&v=4" width="100px;" alt=""/><br /><sub><b>Felix Geisendörfer</b></sub></a><br /><a href="https://github.com/node-formidable/node-formidable/commits?author=felixge" title="Code">💻</a> <a href="#design-felixge" title="Design">🎨</a> <a href="#ideas-felixge" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/node-formidable/node-formidable/commits?author=felixge" title="Documentation">📖</a></td>
    <td align="center"><a href="https://tunnckoCore.com"><img src="https://avatars3.githubusercontent.com/u/5038030?v=4" width="100px;" alt=""/><br /><sub><b>Charlike Mike Reagent</b></sub></a><br /><a href="https://github.com/node-formidable/node-formidable/issues?q=author%3AtunnckoCore" title="Bug reports">🐛</a> <a href="#infra-tunnckoCore" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#design-tunnckoCore" title="Design">🎨</a> <a href="https://github.com/node-formidable/node-formidable/commits?author=tunnckoCore" title="Code">💻</a> <a href="https://github.com/node-formidable/node-formidable/commits?author=tunnckoCore" title="Documentation">📖</a> <a href="#example-tunnckoCore" title="Examples">💡</a> <a href="#ideas-tunnckoCore" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-tunnckoCore" title="Maintenance">🚧</a> <a href="https://github.com/node-formidable/node-formidable/commits?author=tunnckoCore" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/kedarv"><img src="https://avatars1.githubusercontent.com/u/1365665?v=4" width="100px;" alt=""/><br /><sub><b>Kedar</b></sub></a><br /><a href="https://github.com/node-formidable/node-formidable/commits?author=kedarv" title="Code">💻</a> <a href="https://github.com/node-formidable/node-formidable/commits?author=kedarv" title="Tests">⚠️</a> <a href="#question-kedarv" title="Answering Questions">💬</a> <a href="https://github.com/node-formidable/node-formidable/issues?q=author%3Akedarv" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/GrosSacASac"><img src="https://avatars0.githubusercontent.com/u/5721194?v=4" width="100px;" alt=""/><br /><sub><b>Walle Cyril</b></sub></a><br /><a href="#question-GrosSacASac" title="Answering Questions">💬</a> <a href="https://github.com/node-formidable/node-formidable/issues?q=author%3AGrosSacASac" title="Bug reports">🐛</a> <a href="https://github.com/node-formidable/node-formidable/commits?author=GrosSacASac" title="Code">💻</a> <a href="#financial-GrosSacASac" title="Financial">💵</a> <a href="#ideas-GrosSacASac" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-GrosSacASac" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/xarguments"><img src="https://avatars2.githubusercontent.com/u/40522463?v=4" width="100px;" alt=""/><br /><sub><b>Xargs</b></sub></a><br /><a href="#question-xarguments" title="Answering Questions">💬</a> <a href="https://github.com/node-formidable/node-formidable/issues?q=author%3Axarguments" title="Bug reports">🐛</a> <a href="https://github.com/node-formidable/node-formidable/commits?author=xarguments" title="Code">💻</a> <a href="#maintenance-xarguments" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/Amit-A"><img src="https://avatars1.githubusercontent.com/u/7987238?v=4" width="100px;" alt=""/><br /><sub><b>Amit-A</b></sub></a><br /><a href="#question-Amit-A" title="Answering Questions">💬</a> <a href="https://github.com/node-formidable/node-formidable/issues?q=author%3AAmit-A" title="Bug reports">🐛</a> <a href="https://github.com/node-formidable/node-formidable/commits?author=Amit-A" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://charmander.me/"><img src="https://avatars1.githubusercontent.com/u/1889843?v=4" width="100px;" alt=""/><br /><sub><b>Charmander</b></sub></a><br /><a href="#question-charmander" title="Answering Questions">💬</a> <a href="https://github.com/node-formidable/node-formidable/issues?q=author%3Acharmander" title="Bug reports">🐛</a> <a href="https://github.com/node-formidable/node-formidable/commits?author=charmander" title="Code">💻</a> <a href="#ideas-charmander" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-charmander" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://twitter.com/dylan_piercey"><img src="https://avatars2.githubusercontent.com/u/4985201?v=4" width="100px;" alt=""/><br /><sub><b>Dylan Piercey</b></sub></a><br /><a href="#ideas-DylanPiercey" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://ochrona.jawne.info.pl"><img src="https://avatars1.githubusercontent.com/u/3618479?v=4" width="100px;" alt=""/><br /><sub><b>Adam Dobrawy</b></sub></a><br /><a href="https://github.com/node-formidable/node-formidable/issues?q=author%3Aad-m" title="Bug reports">🐛</a> <a href="https://github.com/node-formidable/node-formidable/commits?author=ad-m" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/amitrohatgi"><img src="https://avatars3.githubusercontent.com/u/12177021?v=4" width="100px;" alt=""/><br /><sub><b>amitrohatgi</b></sub></a><br /><a href="#ideas-amitrohatgi" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/fengxinming"><img src="https://avatars2.githubusercontent.com/u/6262382?v=4" width="100px;" alt=""/><br /><sub><b>Jesse Feng</b></sub></a><br /><a href="https://github.com/node-formidable/node-formidable/issues?q=author%3Afengxinming" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://qtmsheep.com"><img src="https://avatars1.githubusercontent.com/u/7271496?v=4" width="100px;" alt=""/><br /><sub><b>Nathanael Demacon</b></sub></a><br /><a href="#question-quantumsheep" title="Answering Questions">💬</a> <a href="https://github.com/node-formidable/node-formidable/commits?author=quantumsheep" title="Code">💻</a> <a href="https://github.com/node-formidable/node-formidable/pulls?q=is%3Apr+reviewed-by%3Aquantumsheep" title="Reviewed Pull Requests">👀</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/MunMunMiao"><img src="https://avatars1.githubusercontent.com/u/18216142?v=4" width="100px;" alt=""/><br /><sub><b>MunMunMiao</b></sub></a><br /><a href="https://github.com/node-formidable/node-formidable/issues?q=author%3AMunMunMiao" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/gabipetrovay"><img src="https://avatars0.githubusercontent.com/u/1170398?v=4" width="100px;" alt=""/><br /><sub><b>Gabriel Petrovay</b></sub></a><br /><a href="https://github.com/node-formidable/node-formidable/issues?q=author%3Agabipetrovay" title="Bug reports">🐛</a> <a href="https://github.com/node-formidable/node-formidable/commits?author=gabipetrovay" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Elzair"><img src="https://avatars0.githubusercontent.com/u/2352818?v=4" width="100px;" alt=""/><br /><sub><b>Philip Woods</b></sub></a><br /><a href="https://github.com/node-formidable/node-formidable/commits?author=Elzair" title="Code">💻</a> <a href="#ideas-Elzair" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/dmolim"><img src="https://avatars2.githubusercontent.com/u/7090374?v=4" width="100px;" alt=""/><br /><sub><b>Dmitry Ivonin</b></sub></a><br /><a href="https://github.com/node-formidable/node-formidable/commits?author=dmolim" title="Documentation">📖</a></td>
    <td align="center"><a href="https://audiobox.fm"><img src="https://avatars1.githubusercontent.com/u/12844?v=4" width="100px;" alt=""/><br /><sub><b>Claudio Poli</b></sub></a><br /><a href="https://github.com/node-formidable/node-formidable/commits?author=masterkain" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

Formidable is licensed under the [MIT License][license-url].

<!-- badges -->
<!-- prettier-ignore-start -->

[codestyle-url]: https://github.com/airbnb/javascript
[codestyle-img]: https://badgen.net/badge/code%20style/airbnb%20%2B%20prettier/ff5a5f?icon=airbnb&cache=300
[codecov-url]: https://codecov.io/gh/node-formidable/node-formidable
[codecov-img]: https://badgen.net/codecov/c/github/node-formidable/node-formidable/master?icon=codecov
[npmv-canary-img]: https://badgen.net/npm/v/formidable/canary?icon=npm
[npmv-dev-img]: https://badgen.net/npm/v/formidable/dev?icon=npm
[npmv-img]: https://badgen.net/npm/v/formidable?icon=npm
[npmv-url]: https://npmjs.com/package/formidable
[license-img]: https://badgen.net/npm/license/formidable
[license-url]: https://github.com/node-formidable/node-formidable/blob/master/LICENSE
[chat-img]: https://badgen.net/badge/chat/on%20gitter/46BC99?icon=gitter
[chat-url]: https://gitter.im/node-formidable/Lobby
[libera-manifesto-url]: https://liberamanifesto.com
[libera-manifesto-img]: https://badgen.net/badge/libera/manifesto/grey
[renovateapp-url]: https://renovatebot.com
[renovateapp-img]: https://badgen.net/badge/renovate/enabled/green?cache=300
[prs-welcome-img]: https://badgen.net/badge/PRs/welcome/green?cache=300
[prs-welcome-url]: http://makeapullrequest.com
[twitter-url]: https://twitter.com/tunnckoCore
[twitter-img]: https://badgen.net/twitter/follow/tunnckoCore?icon=twitter&color=1da1f2&cache=300

[npm-weekly-img]: https://badgen.net/npm/dw/formidable?icon=npm&cache=300
[npm-monthly-img]: https://badgen.net/npm/dm/formidable?icon=npm&cache=300
[npm-yearly-img]: https://badgen.net/npm/dy/formidable?icon=npm&cache=300
[npm-alltime-img]: https://badgen.net/npm/dt/formidable?icon=npm&cache=300&label=total%20downloads

[nodejs-img]: https://badgen.net/badge/node/>=%2010.13/green?cache=300

[ccommits-url]: https://conventionalcommits.org/
[ccommits-img]: https://badgen.net/badge/conventional%20commits/v1.0.0/green?cache=300

[contributing-url]: https://github.com/node-formidable/node-formidable/blob/master/CONTRIBUTING.md
[code_of_conduct-url]: https://github.com/node-formidable/node-formidable/blob/master/CODE_OF_CONDUCT.md

[open-issue-url]: https://github.com/node-formidable/node-formidable/issues/new

[tidelift-url]: https://tidelift.com/subscription/pkg/npm-formidable?utm_source=npm-formidable&utm_medium=referral&utm_campaign=enterprise
[tidelift-img]: https://badgen.net/badge/tidelift/subscription/4B5168?labelColor=F6914D

[kofi-url]: https://ko-fi.com/tunnckoCore/commissions
[kofi-img]: https://badgen.net/badge/ko-fi/support/29abe0c2?cache=300&icon=https://rawcdn.githack.com/tunnckoCore/badgen-icons/f8264c6414e0bec449dd86f2241d50a9b89a1203/icons/kofi.svg

[linux-build-img]: https://badgen-net.charlike.now.sh/github/checks/node-formidable/node-formidable?label=linux%20build&icon=github
[macos-build-img]: https://badgen-net.charlike.now.sh/github/checks/node-formidable/node-formidable?label=macos%20build&icon=github
[windows-build-img]: https://badgen-net.charlike.now.sh/github/checks/node-formidable/node-formidable?label=windows%20build&icon=github
[build-url]: https://github.com/node-formidable/node-formidable/actions?query=workflow%3Anodejs
<!-- prettier-ignore-end -->
